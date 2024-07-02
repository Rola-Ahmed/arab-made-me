import ReactPaginate from "react-paginate";

export default function PaginationDash(props) {
  let { pagination, setPagination } = props;
  const handlePageClick = (currentPage) => {
    // why plus 1 bec react pagination library reads the 1st page with index 0 but in api  is read with index 1
    setPagination((prevValue) => ({
      ...prevValue,
      currentPage: currentPage.selected + 1,
    }));
  };

  return (
    <ReactPaginate
      previousLabel={
        <p>
          <i className="fa-solid fa-arrow-left pe-2 text-dark "></i>
          previous
        </p>
      }
      nextLabel={
        <p>
          next
          <i className="fa-solid fa-arrow-right ps-2 text-dark "></i>
        </p>
      }
      pageCount={pagination?.totalPage ?? 1} // total number to pages
      forcePage={0} //to set a page to start with, defult middle page
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      marginPagesDisplayed={1}
      containerClassName="pagination align-items-center justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      previousClassName="page-item-prev  me-3"
      previousLinkClassName="page-link text-dark margin-prev"
      nextClassName="page-item-next ms-3"
      nextLinkClassName="page-link text-dark margin-next"
      navClassName="pagination-custom"
    />
  );
}
