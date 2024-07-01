import ReactPaginate from "react-paginate";

export default function PublicPaginate(props) {
  let { pagination, setPagination } = props;

  // gets the current page
  const handlePageClick = (currentPage) => {
    setPagination((prevValue) => ({
      ...prevValue,
      // why +1 bec the library starts from 0
      // the library consider the 1st page as 0 will in the api i consider the 1st page as index 1
      currentPage: currentPage.selected + 1,
    }));
  };

  return (
    <ReactPaginate
      previousLabel={<i className="fa-solid fa-arrow-left"></i>}
      nextLabel={<i className="fa-solid fa-arrow-right"></i>}
      pageCount={pagination?.totalPage ?? 1} // total number to pages
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      forcePage={0}
      onPageChange={handlePageClick}
      containerClassName="pagination align-items-center justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      previousClassName="page-item "
      previousLinkClassName="page-link arrow-link-color margin-prev"
      nextClassName="page-item "
      nextLinkClassName="page-link arrow-link-color margin-next"
      navClassName="pagination-custom"
    />
  );
}
