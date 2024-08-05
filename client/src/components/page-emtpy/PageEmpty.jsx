import "./page-empty.scss";
import PropTypes from "prop-types";

const PageEmpty = ({ title, subTitle, notFound }) => (
  <div className="page-empty">
    <h1
      className="clr-neutral-800 fw-black margin-block-end-2"
      style={{ fontSize: "2rem" }}
    >
      {notFound ? "This account doesn’t exist" : title}
    </h1>
    <p className="fs-300 clr-neutral-600">
      {notFound ? "Try searching for another." : subTitle}
    </p>
  </div>
);

PageEmpty.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  notFound: PropTypes.bool,
};

export default PageEmpty;
