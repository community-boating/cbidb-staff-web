import * as React from "react";
import * as t from "io-ts";
import { Form, FormGroup, Label, Col, Input } from "reactstrap";
import { ColumnDescription } from "react-bootstrap-table-next";

// Table building utilities
import { tableColWidth } from "@util/tableUtil";
import { OptionifiedProps } from "@util/OptionifyObjectProps";

// Validator and putter for the data type of this page
import { tagValidator } from "@async/rest/tags";
import { putWrapper as putTag } from "@async/rest/tags";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "@components/ReportWithModalForm";

type Tag = t.TypeOf<typeof tagValidator>;

export default function ManageTagsPage(props: { tags: Tag[] }) {
    // Block the default "enter" event on inputs which otherwise
    // results in a page reload
    function blockDefaultEnter(e: React.KeyboardEvent) {
        if (e.key === "Enter") e.preventDefault();
    }

    // Define table columns
    const columns: ColumnDescription[] = [
        {
            dataField: "edit",
            text: "",
            ...tableColWidth(50),
        },
        {
            dataField: "TAG_ID",
            text: "ID",
            sort: true,
            ...tableColWidth(80),
        },
        {
            dataField: "TAG_NAME",
            text: "Tag Name",
            sort: true,
        },
    ];

    // Define edit/add form
    const form = (
        rowForEdit: OptionifiedProps<Tag>,
        updateState: (id: string, value: string) => void
    ) => (
        <Form>
            <FormGroup row>
                <Label sm={2} className="text-sm-right">
                    ID
                </Label>
                <Col sm={10}>
                    <div style={{ textAlign: "left", padding: "5px 14px" }}>
                        {rowForEdit.TAG_ID.map(String).getOrElse("(none)")}
                    </div>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} className="text-sm-right">
                    Tag Name
                </Label>
                <Col sm={10}>
                    <Input
                        type="text"
                        name="tagName"
                        placeholder="Tag Name"
                        value={rowForEdit.TAG_NAME.getOrElse("")}
                        onKeyDown={blockDefaultEnter}
                        onChange={(event) =>
                            updateState("TAG_NAME", event.target.value)
                        }
                    />
                </Col>
            </FormGroup>
        </Form>
    );

    return (
        <ReportWithModalForm
            rowValidator={tagValidator}
            rows={props.tags}
            primaryKey="TAG_ID"
            columns={columns}
            form={form}
            submitRow={putTag}
            cardTitle="Tags"
        />
    );
}
