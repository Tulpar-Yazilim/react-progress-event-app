import PropTypes from "prop-types";
import React from "react";
import { Col, Container, Row } from "shards-react";

const DefaultLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <Col className="main-content p-0" tag="main">
        {children}
      </Col>
    </Row>
  </Container>
);

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default DefaultLayout;
