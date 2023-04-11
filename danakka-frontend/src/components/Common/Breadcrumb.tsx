import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

interface BreadcrumbProps {
  breadcrumbItem: string;
  title: string;
}

const Breadcrumb = ({ breadcrumbItem, title }: BreadcrumbProps) => {
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0">{breadcrumbItem}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem>
                <Link to="#">{title}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                <Link to="#">{breadcrumbItem}</Link>
              </BreadcrumbItem>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;