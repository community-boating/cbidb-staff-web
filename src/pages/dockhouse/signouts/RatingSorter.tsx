import { ratingValidator, programsValidator, boatsValidator } from "async/rest/signouts-tables";
import { option } from "fp-ts";
import { ReactNode } from "react";
import * as React from 'react';
import { FlagStatusIcons } from "./FlagStatusIcons"
import * as t from "io-ts";
import { Popover } from "reactstrap";
import { SignoutTablesState, RatingsValidatorState, programsHR } from "./SignoutsTablesPage";


type RatingValidatorState = t.TypeOf<typeof ratingValidator>;
type ProgramValidatorState = t.TypeOf<typeof programsValidator>;
type BoatValidatorState = t.TypeOf<typeof boatsValidator>;

class RatingsHover extends React.Component<{
	makeChildren: () => ReactNode,
	id: string,
	closeOthers: ((id: string) => void)[]
},{
	children: ReactNode,
	open: boolean
}>{
	constructor(props){
		super(props);
		this.state = {open: false, children: undefined};
		this.props.closeOthers.push((id: string) => {
			if(id != this.props.id){
				if(this.state.open){
					this.setOpen(false);
				}
			}
		});
	}
	setOpen(open: boolean){
		if(open) {
			this.props.closeOthers.forEach((a) => {
				a(this.props.id);
			});
		}
		if(open && this.state.children == undefined){
		this.setState({
			children: this.props.makeChildren(),
			open: open
		});
		}else{
			this.setState({
				...this.state,
				open: open
			});
		}
	}
	toggleOpen(){
		this.setOpen(!this.state.open);
	}
	render(){
		return (<>
			<a id={this.props.id} onClick={() => this.toggleOpen} onMouseOver={() => this.setOpen(true)} onMouseOut={() => this.setOpen(false)}>
				Ratings
			</a>
			<Popover placement="bottom" isOpen={this.state.open} target={this.props.id} toggle={() => this.toggleOpen()}>
				{this.state.children || ""}
			</Popover>
		</>);
	}
}

function drawRatingBucket(currentRatings: {[key:number] : boolean}, ratingBucket: RatingTreeNode[], program: number){
	if(ratingBucket.length == 0){
		return "";
	}
	var highest : RatingValidatorState = undefined;
	for(var node of ratingBucket){
		highest = findHighestRating(currentRatings, node, program);
		if(highest != undefined){
			break;
		}
	}
	var hasRating = true;
	if(highest == undefined){
		highest = ratingBucket[0].rating;
		hasRating = false;
	}
	return <span style={hasRating ? {color: "red"} : {}}>{highest.ratingName}</span>
}

export function makeRatingsHover(row: SignoutTablesState, sortedRatings: RatingTreeNode[][][], orphanedRatings: RatingValidatorState[], hiddenOrphanedRatings: {[key: number]: boolean}, closeOthers: ((id: string) => void)[]){
	if(sortedRatings.length == 0){
		return <p>Loading...</p>;
	}

	const currentRatings = {};

	row.$$skipper.$$personRatings.forEach((a) => {
		currentRatings[a.ratingId] = true;
	});

	const makeHover = () => {
		var programHR = "Unknown Program";
		programsHR.forEach((a) => {
			if(a.value == row.programId){
				programHR = a.display;
			}
		})
		return (<div>
			<h3 style={{textAlign:"center"}}>{programHR}</h3>
			<table>
				<tbody>
					{sortedRatings.map((a, i) => {return <tr key={i}>
						{a.map((b, j) => {return <td key={j} valign="top">
							{drawRatingBucket(currentRatings,b,row.programId)}
						</td>})}
					</tr>})}
					<tr>
						<td><hr/></td>
						<td><hr/></td>
						<td><hr/></td>
					</tr>
					{makeOrphanedTableRows(currentRatings, orphanedRatings, hiddenOrphanedRatings, row.programId)}
				</tbody>
			</table></div>);
	}

	return (
		<RatingsHover id={"ratings" + String(row.signoutId)} makeChildren={makeHover} closeOthers={closeOthers}/>
	)
}

function makeOrphanedTableRows(currentRatings, orphanedRatings: RatingValidatorState[], hiddenOrphanedRatings: {[key: number] : boolean}, program: number){
	const filteredOrphanedRatings = orphanedRatings.filter((a) => hiddenOrphanedRatings[a.ratingId] == undefined && hasProgram(program, a.$$programs, a.$$boats));
	const tableRows = [];
	for(var i = 0; i < Math.ceil(filteredOrphanedRatings.length/3); i++){
		tableRows.push(<tr key={i}>
			<td key="1" valign="top">{3*i < filteredOrphanedRatings.length ? drawRatingBucket(currentRatings, [{rating:filteredOrphanedRatings[3*i], children: []}], program) : ""}</td>
			<td key="2" valign="top">{3*i + 1 < filteredOrphanedRatings.length ? drawRatingBucket(currentRatings, [{rating:filteredOrphanedRatings[3*i+1], children: []}], program) : ""}</td>
			<td key="3" valign="top">{3*i + 2 < filteredOrphanedRatings.length ? drawRatingBucket(currentRatings, [{rating:filteredOrphanedRatings[3*i+2], children: []}], program) : ""}</td>
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
	//Flag to know if this is a different color than its parent
	clipped?: boolean
}

function findHighestRating(currentRatings: {[key:number] : boolean}, ratingBucket: RatingTreeNode, program: number) : RatingValidatorState{
	if(ratingBucket.parents != undefined){
		for(var parent of ratingBucket.parents){
			if(currentRatings[parent.ratingId] != undefined && hasProgram(program, parent.$$programs, parent.$$boats)){
				return parent;
			}
		}
	}
	return findHighestRatingRecursive(currentRatings, ratingBucket, program);
}

function findHighestRatingRecursive(currentRatings: {[key:number] : boolean}, ratingBucket: RatingTreeNode, program: number) : RatingValidatorState{
	if((currentRatings[ratingBucket.rating.ratingId] != undefined) && hasProgram(program, ratingBucket.rating.$$programs, ratingBucket.rating.$$boats)){
		return ratingBucket.rating;
	}else{
		for(var child of ratingBucket.children){
			if(child.clipped != true){
				var ret = findHighestRatingRecursive(currentRatings, child, program);
				if(ret != undefined){
					return ret;
				}
			}
		}
	}
	return undefined;
}

function endsHRColor(color: string, rating: RatingValidatorState){
	return FlagStatusIcons[color] != undefined && rating.ratingName.endsWith(FlagStatusIcons[color].hr);
}

function isColor(color: string, rating: RatingValidatorState, isOther: boolean){
	if(rating.$$boats.length == 0){
		//TODO this is pretty hacky, need to pass more information about the rating so we know if it is a single colored rating but has no assigned boats (spinnaker currently)
		if(rating.ratingName.startsWith("Spinnaker")){
			return isOther ? !endsHRColor(color, rating) : endsHRColor(color, rating);
		}else{
			return false;
		}
	}
	for(var boat of rating.$$boats){
		if(isOther ? boat.flag == color : boat.flag != color){
			return false;
		}
	}
	return true;
}

function isSingleColor(color: string, rating: RatingValidatorState){
	return isColor(color, rating, false);
}

function isOtherColor(color: string, rating: RatingValidatorState){
	return isColor(color, rating, true);
}

function findFirstSingleColors(color: string, parentColor: string, ratingsTree: RatingTreeNode){
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

function clipChildrenSimilarColor(color: string, ratingsTree: RatingTreeNode){
	if(isSingleColor(color, ratingsTree.rating)){
		ratingsTree.children.forEach((a) => {
			clipChildrenSimilarColor(color, a);
		});
	}else{
		ratingsTree.clipped=true;
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

function makeRatingsRows(ratingTreeTop: RatingValidatorState, ratingsById: {[key: number]: RatingValidatorState}, ratingsByOverrideId: {[key: number]: number[]}){
	const tree = getChildren({rating: ratingTreeTop, children:[]},ratingsById,ratingsByOverrideId);
	const red = findFirstSingleColors("R", "", tree);
	const ratingsRows: RatingTreeNode[][][] = [];
	red.forEach((a) => {
		ratingsRows.push(makeRatingsBuckets(a,ratingsById));
	});
	return ratingsRows;
}

function makeRatingsBuckets(red: RatingTreeNode, ratingsById: {[key: number]: RatingValidatorState}) : RatingTreeNode[][]{
	red.parents = getSimilarColorParents("R",red.rating.ratingId, ratingsById);
	clipChildrenSimilarColor("R", red);
	var yellows = findFirstSingleColors("Y", "R", red);
	var greens = [];
	yellows.forEach((a) => {
		a.parents = getSimilarColorParents("Y", a.rating.ratingId, ratingsById);
		clipChildrenSimilarColor("Y", a);
		greens = greens.concat(findFirstSingleColors("G", "Y", a));
	});
	greens.forEach((a) => {
		a.parents = getSimilarColorParents("G", a.rating.ratingId, ratingsById);
		clipChildrenSimilarColor("G", a);
	});
	return [[red],yellows,greens];
}

export function sortRatings(ratings: RatingsValidatorState) : RatingTreeNode[][][]{
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
	ratingsTreesTops = ratingsTreesTops.filter((a) => a.$$programs.length > 0);
	ratingsTreesTops.forEach((a) => {
		const ratingsRows = makeRatingsRows(a, ratingsById, ratingsByOverrideId);
		if(ratingsRows.length > 0){
			ratingsRowsTotal = ratingsRowsTotal.concat(ratingsRows);
		}
	});

	ratingsRowsTotal = ratingsRowsTotal.sort((a, b) => a[0][0].rating.ratingId-b[0][0].rating.ratingId);
	
	return ratingsRowsTotal;
}

export function findOrphanedRatings(ratings: RatingsValidatorState, ratingsRows: RatingTreeNode[][][]){
	var foundRatings: {[key: number]: boolean} = {};
	ratingsRows.forEach((a) =>{
		a.forEach((b) => {
			b.forEach((c) => {
				findOrphanedRecursive(foundRatings, c);
				if(c.parents != undefined){
					c.parents.forEach((d) => {
						foundRatings[d.ratingId] = true;
					});
				}
			});
		});
	});
	return ratings.filter((a) => foundRatings[a.ratingId] == undefined).sort((a, b) => {
		if(option.isSome(a.overriddenBy) && option.isSome(b.overriddenBy)){
			return (a.overriddenBy.getOrElse(0) - b.overriddenBy.getOrElse(0));
		}else if(option.isSome(a.overriddenBy)){
			return 1;
		}else if(option.isSome(b.overriddenBy)){
			return -1;
		}else{
			return a.ratingId - b.ratingId;
		}
		});
}

function findOrphanedRecursive(foundRatings: {[key: number]: boolean}, node: RatingTreeNode){
	foundRatings[node.rating.ratingId] = true;
	node.children.forEach((a) => {
		if(a.clipped != true){
			findOrphanedRecursive(foundRatings, a);
		}
	});
}

function getChildren(cur: RatingTreeNode,ratingsById: {[key: number]: RatingValidatorState}, ratingsByOverrideId: {[key: number]: number[]}){
	return {rating: cur.rating, children: (ratingsByOverrideId[cur.rating.ratingId] || []).map((a) => getChildren({rating: ratingsById[a], children:[]},ratingsById,ratingsByOverrideId))};
}

function hasProgram(programId: number, programs: ProgramValidatorState[], boats: BoatValidatorState[]){
	if(boats.length == 0){
		//return false;
	}
	for(var a of programs) {
		if(a.programId == programId){
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