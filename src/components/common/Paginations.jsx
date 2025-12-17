 import {useState} from "react"
const Pagination = () => {

  
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination mb-0 flex space-x-2">
          <li className="page-item">
            <a className="page-link px-3 py-2 bg-gray-200 rounded-lg" href="#">
              &laquo;
            </a>
          </li>
          <li className="page-item active">
            <a className="page-link px-3 py-2 bg-blue-500 text-white rounded-lg" href="#">1</a>
          </li>
          <li className="page-item">
            <a className="page-link px-3 py-2 bg-gray-200 rounded-lg" href="#">2</a>
          </li>
          <li className="page-item">
            <a className="page-link px-3 py-2 bg-gray-200 rounded-lg" href="#">3</a>
          </li>
          <li className="page-item">
            <a className="page-link px-3 py-2 bg-gray-200 rounded-lg" href="#">
              &raquo;
            </a>
          </li>
        </ul>
      </nav>
    );
  };
   export default  Pagination