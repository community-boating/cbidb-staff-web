import * as React from "react";
import * as t from "io-ts";
import { tableColWidth } from "@util/tableUtil";
import { classInstructorValidator } from "@async/rest/class-instructor";
import { ColumnDescription } from "react-bootstrap-table-next";
import ReportWithModalForm from "@components/ReportWithModalForm";
import { putWrapper as putInstructor } from "@async/rest/class-instructor";
import { Form, FormGroup, Label, Col, Input } from "reactstrap";
import { OptionifiedProps } from "@util/OptionifyObjectProps";

type ClassInstructor = t.TypeOf<typeof classInstructorValidator>;

export default function ManageClassInstructorsPage(props: {
    instructors: ClassInstructor[];
}) {
    const columns: ColumnDescription[] = [
        {
            dataField: "edit",
            text: "",
            ...tableColWidth(50),
        },
        {
            dataField: "INSTRUCTOR_ID",
            text: "ID",
            sort: true,
            ...tableColWidth(80),
        },
        {
            dataField: "NAME_FIRST",
            text: "First Name",
            sort: true,
            ...tableColWidth(300),
        },
        {
            dataField: "NAME_LAST",
            text: "Last Name",
            sort: true,
        },
    ];

    const form = (
        rowForEdit: OptionifiedProps<ClassInstructor>,
        updateState: (id: string, value: string) => void
    ) => (
        <Form>
            <FormGroup row>
                <Label sm={2} className="text-sm-right">
                    ID
                </Label>
                <Col sm={10}>
                    <div style={{ textAlign: "left", padding: "5px 14px" }}>
                        {rowForEdit.INSTRUCTOR_ID.map(String).getOrElse(
                            "(none)"
                        )}
                    </div>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} className="text-sm-right">
                    First Name
                </Label>
                <Col sm={10}>
                    <Input
                        type="text"
                        name="nameFirst"
                        placeholder="First Name"
                        value={rowForEdit.NAME_FIRST.getOrElse("")}
                        onChange={(event) =>
                            updateState("NAME_FIRST", event.target.value)
                        }
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} className="text-sm-right">
                    Last Name
                </Label>
                <Col sm={10}>
                    <Input
                        type="text"
                        name="nameLast"
                        placeholder="Last Name"
                        id="nameLast"
                        value={rowForEdit.NAME_LAST.getOrElse("")}
                        onChange={(event) =>
                            updateState("NAME_LAST", event.target.value)
                        }
                    />
                </Col>
            </FormGroup>
        </Form>
    );

    return (
        <ReportWithModalForm
            rowValidator={classInstructorValidator}
            rows={props.instructors}
            primaryKey="INSTRUCTOR_ID"
            columns={columns}
            form={form}
            submitRow={putInstructor}
            cardTitle="Class Instructors"
        />
    );
}
