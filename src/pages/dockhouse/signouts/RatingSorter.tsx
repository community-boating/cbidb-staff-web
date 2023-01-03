import { ratingValidator, programsValidator, boatsValidator, personRatingValidator } from "async/staff/dockhouse/signouts-tables";
import { option } from "fp-ts";
import * as React from 'react';
import { FlagStatusIcons } from "../../../components/dockhouse/FlagStatusIcons"
import * as t from "io-ts";
import { MultiHover } from "./MultiHover";
import { ReactNode } from "react";
import { programsHR } from "./Constants";
import { SignoutTablesState, RatingsValidatorState, SignoutsTablesExtraState } from "./StateTypes";


type RatingValidatorState = t.TypeOf<typeof ratingValidator>;
type ProgramValidatorState = t.TypeOf<typeof programsValidator>;
type BoatValidatorState = t.TypeOf<typeof boatsValidator>;
type PersonRatingValidatorState = t.TypeOf<typeof personRatingValidator>;

//Display a precomputed ratingBucket with current ratings and program information for a given person.
function drawRatingBucket(currentRatings: {[key:number] : PersonRatingValidatorState[]}, ratingBucket: RatingTreeNode[], program: number, isOrphaned: boolean){
	if(ratingBucket.length == 0){
		return undefined;
	}
	var highest : RatingTreeNode[] = undefined;
	for(var node of ratingBucket){
		const nodeHighest = findHighestRating(currentRatings, node, program, isOrphaned);
		if(nodeHighest != undefined){
			highest = (highest || []).concat(nodeHighest);
		}
	}
	var isDefault = false;
	if(highest == undefined){
		highest = [ratingBucket[0]];
		isDefault = true;
		if(!hasProgram(program, highest[0].rating.$$programs, highest[0].rating.$$boats) && !hasRatingRecursive(currentRatings, highest[0], program, isOrphaned ? undefined : highest[0].rating.ratingId)){
			return undefined;
		}
	}
	return <>{highest.map((a, i) => <span style={hasRating(currentRatings, a.rating.ratingId, program) ? {color: "red"} : {}}key={i}>{a.rating.ratingName}</span>)}</>;
}
export function getMakeRatingsTable(row: SignoutTablesState, sortedRatings: SortedRatings, orphanedRatingsShownByDefault: {[key: number]: boolean}){
	if(sortedRatings.ratingsRows.length == 0){
		return () => <p>Loading...</p>;
	}

	const currentRatings = {};

	row.$$skipper.$$personRatings.forEach((a) => {
		if(row.programId == a.programId){
			currentRatings[a.ratingId] = (currentRatings[a.ratingId] || []).concat(a);
		}
	});

	const makeTable = () => {
		var programHR = "Unknown Program";
		programsHR.forEach((a) => {
			if(a.value == row.programId){
				programHR = a.display;
			}
		});
		var drawnRows: ReactNode[][] = sortedRatings.ratingsRows.map((a, i) => a.map((b, i) => drawRatingBucket(currentRatings,b,row.programId,false)));
		drawnRows.forEach((a, i) => {
			drawnRows[i] = a.filter((b) => b !== undefined);
		});
		drawnRows = drawnRows.filter((a) => a.length > 0);
		return (<div>
			<h3 style={{textAlign:"center"}}>{programHR}</h3>
			<table className="table table-sm">
				<tbody>
					{drawnRows.map((a, i) => {return <tr key={i}>
						{a.map((drawnRow, j) => {return <td key={j} valign="top">
							{drawnRow}
						</td>})}
					</tr>})}
					{makeOrphanedTableRows(currentRatings, sortedRatings.orphanedRatings, orphanedRatingsShownByDefault, row.programId)}
				</tbody>
			</table></div>);
	};
	return makeTable;
}

export const RatingsHover = (props: {row: SignoutTablesState, orphanedRatingsShownByDefault: {[key: number]: boolean}, extraState: SignoutsTablesExtraState}) => {

	const sortedRatings = props.extraState.ratingsSorted;

	const makeHover = getMakeRatingsTable(props.row, sortedRatings, props.orphanedRatingsShownByDefault);

	return (
		<MultiHover makeChildren={makeHover} openDisplay={"Ratings"}/>
	)
}

function makeOrphanedTableRows(currentRatings: {[key: number]: PersonRatingValidatorState[]}, orphanedRatings: RatingTreeNode[], orphanedRatingsShownByDefault: {[key: number] : boolean}, program: number){
	const filteredOrphanedRatings = orphanedRatings.filter((a) => (orphanedRatingsShownByDefault[a.rating.ratingId] !== undefined && hasProgram(program, a.rating.$$programs, a.rating.$$boats)) || hasRatingRecursive(currentRatings, a, program, undefined));
	const tableRows = [];
	for(var i = 0; i < Math.ceil(filteredOrphanedRatings.length/2); i++){
		tableRows.push(<tr key={i}>
			<td key="1" valign="top">{2*i < filteredOrphanedRatings.length ? drawRatingBucket(currentRatings, [filteredOrphanedRatings[2*i]], program,true) : ""}</td>
			<td key="2" valign="top">{2*i + 1 < filteredOrphanedRatings.length ? drawRatingBucket(currentRatings, [filteredOrphanedRatings[2*i+1]], program,true) : ""}</td>
		</tr>);
	}
	return tableRows;
}

type RatingTreeNode = {
	//Rating represented by this node in the graph
	rating: RatingValidatorState,
	//Similar children (overridden by this rating and not a different flag color)
	children: RatingTreeNode[],
	//Similar parents (overriding this rating and not a different flag color, ordered by override)
	parents?: RatingValidatorState[],
	//Rating Id for the base node of this tree (useful when the node is a child of a similar parent)
	baseNodeId?: number
}

function findHighestRating(currentRatings: {[key:number] : PersonRatingValidatorState[]}, ratingBucket: RatingTreeNode, program: number, isOrphaned: boolean) : RatingTreeNode[]{
	if(ratingBucket.parents != undefined){
		for(var parent of ratingBucket.parents){
			if(hasRating(currentRatings, parent.ratingId, program)){
				return [{rating: parent, children: []}];
			}
		}
	}
	return findHighestRatingRecursive(currentRatings, ratingBucket, program, isOrphaned ? undefined : ratingBucket.rating.ratingId);
}

function findHighestRatingRecursive(currentRatings: {[key:number] : PersonRatingValidatorState[]}, ratingBucket: RatingTreeNode, program: number, baseNodeId: number) : RatingTreeNode[]{
	if(hasRating(currentRatings, ratingBucket.rating.ratingId, program)){
		return [ratingBucket];
	}else{
		var multiRet = [];
		for(var child of ratingBucket.children){
			if(isContinued(child, baseNodeId)){
				var ret = findHighestRatingRecursive(currentRatings, child, program, baseNodeId);
				if(ret != undefined){
					multiRet = multiRet.concat(ret);
				}
			}
		}
		if(multiRet.length > 0){
			return multiRet;
		}
	}
	return undefined;
}

function isContinued(ratingTreeNode: RatingTreeNode, baseNodeId: number){
	return baseNodeId === undefined || ratingTreeNode.baseNodeId === baseNodeId;
}

function hasRating(currentRatings: {[key:number] : PersonRatingValidatorState[]}, ratingId: number, program: number){
	if(currentRatings[ratingId] === undefined){
		return false;
	}
	for(var rating of currentRatings[ratingId]){
		if(rating.programId == program){
			return true;
		}
	}
	return false;
}


function hasRatingRecursive(currentRatings: {[key:number] : PersonRatingValidatorState[]}, rating: RatingTreeNode, program: number, baseNodeId: number){
	if(rating.parents != undefined){
		for(var parent of rating.parents){
			if(hasRating(currentRatings, parent.ratingId, program)){
				return true;
			}
		}
	}
	if(hasRating(currentRatings, rating.rating.ratingId, program)){
		return true;
	}else{
		for(var child of rating.children){
			if(isContinued(child, baseNodeId) && hasRatingRecursive(currentRatings, child, program, baseNodeId)){
				return true;
			}
		}
	}
	return false;
}

function endsHRColor(color: string, rating: RatingValidatorState){
	return FlagStatusIcons[color] != undefined && rating.ratingName.endsWith(FlagStatusIcons[color].hr);
}

function isColor(color: string, rating: RatingValidatorState, isOther: boolean){
	if(rating.$$boats.length == 0){
		//TODO this is pretty hacky, need to pass more information about the rating so we know if it is a single colored rating but has no assigned boats (spinnaker currently)
		//Probably just add a boat with a null id or a -1 id and a flag color, that way no database schema changes would be required.
		if(rating.ratingName.startsWith("Spinnaker")){
			return isOther ? !endsHRColor(color, rating) : endsHRColor(color, rating);
		}else{
			return false;
		}
	}
	const singleColor = getSingleColor(rating);
	if(isOther){
		return singleColor !== undefined && singleColor != color;
	}
	return singleColor !== undefined && singleColor == color;
}

function getSingleColor(rating: RatingValidatorState){
	var color = undefined;
	for(var boat of rating.$$boats){
		if(color !== undefined){
			if(boat.flag != color){
				return undefined;
			}
		}else{
			color = boat.flag;
		}
	}
	return color;
}

function isSingleColor(color: string, rating: RatingValidatorState){
	return isColor(color, rating, false);
}

function isOtherColor(color: string, rating: RatingValidatorState){
	return isColor(color, rating, true);
}

function findFirstSingleColors(color: string, parentColor: string, ratingsTree: RatingTreeNode): RatingTreeNode[]{
	if(isSingleColor(color, ratingsTree.rating)){
		return [ratingsTree];
	}else if(isOtherColor(color, ratingsTree.rating) && !isSingleColor(parentColor, ratingsTree.rating)){
		return [];
	}else{
		var singleColors = [];
		ratingsTree.children.forEach((a) => {
			const single = findFirstSingleColors(color, parentColor, a);
			singleColors = singleColors.concat(single);
		});
		return singleColors;
	}
}

function listHasRatingId(ratingList: RatingValidatorState[], ratingId: number){
	for(var rating of ratingList){
		if(rating.ratingId == ratingId){
			return true;
		}
	}
	return false;
}

function flagChildrenSimilarColor(color: string, ratingsTree: RatingTreeNode, baseNodeId: number, lowerParents: RatingValidatorState[]){
	if(!isOtherColor(color, ratingsTree.rating)){
		if(!listHasRatingId(lowerParents, ratingsTree.rating.ratingId)){
			ratingsTree.baseNodeId = baseNodeId;
		}
		var isBottom = ratingsTree.children.length > 1;
		ratingsTree.children.forEach((a) => {
			if(a.children.length != 0){
				isBottom=false;
			}
		});
		if(isBottom){
			//Dont s
			return;
		}
		ratingsTree.children.forEach((a) => {
			flagChildrenSimilarColor(color, a, baseNodeId, lowerParents);
		});
	}
}

function getSimilarColorParents(color: string, ratingId: number, ratingsById: {[key: number]: RatingValidatorState}){
	var nextId = ratingId;
	var parents = [];
	while(option.isSome(ratingsById[nextId].overriddenBy) && !isOtherColor(color, ratingsById[ratingsById[nextId].overriddenBy.getOrElse(-1)])){
		nextId = ratingsById[nextId].overriddenBy.getOrElse(-1);
		parents.push(ratingsById[nextId]);
	}
	return parents;
}

var getChildrenWatcher = 0;

function makeRatingsRows(ratingTreeTop: RatingValidatorState, ratingsById: {[key: number]: RatingValidatorState}, ratingsByOverrideId: {[key: number]: number[]}) : RatingTreeNode | RatingTreeNode[][][]{
	getChildrenWatcher = 0;
	const tree = getChildren({rating: ratingTreeTop, children:[]},ratingsById,ratingsByOverrideId);
	const red = findFirstSingleColors("R", "", tree);
	if(red.length == 0){
		return tree;
	}
	const ratingsRows: RatingTreeNode[][][] = [];
	red.forEach((a) => {
		ratingsRows.push(makeRatingsBuckets(a,ratingsById));
	});
	return ratingsRows;
}

function makeRatingsBuckets(red: RatingTreeNode, ratingsById: {[key: number]: RatingValidatorState}) : RatingTreeNode[][]{
	red.parents = getSimilarColorParents("R",red.rating.ratingId, ratingsById);
	var yellows = findFirstSingleColors("Y", "R", red);
	var allYellowParents = [];
	var greens = [];
	yellows.forEach((a) => {
		a.parents = getSimilarColorParents("Y", a.rating.ratingId, ratingsById);
		allYellowParents = allYellowParents.concat(a.parents);
		greens = greens.concat(findFirstSingleColors("G", "Y", a));
	});
	flagChildrenSimilarColor("R", red, red.rating.ratingId, allYellowParents);
	var allGreenParents = [];
	greens.forEach((a) => {
		a.parents = getSimilarColorParents("G", a.rating.ratingId, ratingsById);
		allGreenParents = allGreenParents.concat(a.parents);
		flagChildrenSimilarColor("G", a, a.rating.ratingId, []);
	});
	yellows.forEach((a) => {
		flagChildrenSimilarColor("Y", a, a.rating.ratingId, allGreenParents);
	})
	return [[red],yellows,greens];
}

export type SortedRatings = {
	ratingsRows: RatingTreeNode[][][];
	orphanedRatings: RatingTreeNode[];
}

export function sortRatings(ratings: RatingsValidatorState) : SortedRatings{
	const ratingsById : {[key: number]: RatingValidatorState} = {};
	const ratingsByOverrideId: {[key: number]: number[]} = {};
	const inferredProgramIds: number[] = [];
	ratings.forEach((a) => {
		ratingsById[a.ratingId] = a;
		a.$$programs.forEach((b) => {
			if(!inferredProgramIds.contains(b.programId)){
				inferredProgramIds.push(b.programId);
			}
		})
		if(option.isSome(a.overriddenBy)){
			ratingsByOverrideId[a.overriddenBy.getOrElse(-1)] = (ratingsByOverrideId[a.overriddenBy.getOrElse(-1)] || []).concat(a.ratingId);
		}
	});
	var ratingsTreesTops = ratings.filter((a) => option.isNone(a.overriddenBy) && ratingsByOverrideId[a.ratingId] !== undefined);
	var ratingsRowsTotal: RatingTreeNode[][][] = [];
	var orphanedRatings: RatingTreeNode[] = [];
	ratingsTreesTops.forEach((a) => {
		const ratingsRows = makeRatingsRows(a, ratingsById, ratingsByOverrideId);
		if((ratingsRows as RatingTreeNode).rating != undefined){
			orphanedRatings = orphanedRatings.concat(ratingsRows as RatingTreeNode);
		}else if((ratingsRows as RatingTreeNode[][][]).length > 0){
			ratingsRowsTotal = ratingsRowsTotal.concat(ratingsRows as RatingTreeNode[][][]);
		}
	});
	//TODO fix this
	ratingsRowsTotal = ratingsRowsTotal.sort((a, b) => a[0][0].rating.ratingId-b[0][0].rating.ratingId);
	orphanedRatings = orphanedRatings.concat(findOrphanedRatings(ratings,ratingsRowsTotal, orphanedRatings));
	return {ratingsRows: ratingsRowsTotal, orphanedRatings: orphanedRatings};
}

export function findOrphanedRatings(ratings: RatingsValidatorState, ratingsRows: RatingTreeNode[][][], currentOrphans: RatingTreeNode[]) : RatingTreeNode[]{
	var foundRatings: {[key: number]: boolean} = {};
	currentOrphans.forEach((a) => {
		findOrphanedRecursive(foundRatings, a, undefined);
	})
	ratingsRows.forEach((a) =>{
		a.forEach((b) => {
			b.forEach((c) => {
				findOrphanedRecursive(foundRatings, c, c.rating.ratingId);
				if(c.parents != undefined){
					c.parents.forEach((d) => {
						foundRatings[d.ratingId] = true;
					});
				}
			});
		});
	});
	return ratings.map((a) => {return {rating: a, children: []}}).filter((a) => foundRatings[a.rating.ratingId] == undefined).sort((a, b) => {
		if(option.isSome(a.rating.overriddenBy) && option.isSome(b.rating.overriddenBy)){
			return (a.rating.overriddenBy.getOrElse(0) - b.rating.overriddenBy.getOrElse(0));
		}else if(option.isSome(a.rating.overriddenBy)){
			return -1;
		}else if(option.isSome(b.rating.overriddenBy)){
			return 1;
		}else{
			return a.rating.ratingId - b.rating.ratingId;
		}
		});
}

function findOrphanedRecursive(foundRatings: {[key: number]: boolean}, node: RatingTreeNode, baseNodeId: number){
	if(baseNodeId === undefined || isContinued(node, baseNodeId)){
		foundRatings[node.rating.ratingId] = true;
	}
	node.children.forEach((a) => {
		findOrphanedRecursive(foundRatings, a, baseNodeId);
	});
}

function getChildren(cur: RatingTreeNode,ratingsById: {[key: number]: RatingValidatorState}, ratingsByOverrideId: {[key: number]: number[]}){
	if(getChildrenWatcher > 10000){
		alert("Overflow while building ratings inheritance tree, contact Jon!");
		return;
	}
	getChildrenWatcher=getChildrenWatcher+1;
	return {rating: cur.rating, children: (ratingsByOverrideId[cur.rating.ratingId] || []).map((a) => getChildren({rating: ratingsById[a], children:[]},ratingsById,ratingsByOverrideId))};
}

function hasProgram(programId: number, programs: ProgramValidatorState[], boats: BoatValidatorState[]){
	if(boats.length === 0){
		//return false;
	}
	for(var a of programs) {
		if(a.programId === programId){
			return true;
		}
	}
	for(var b of boats){
		if(b.programId == programId){
			//return true;
		}
	}
	return false;
}