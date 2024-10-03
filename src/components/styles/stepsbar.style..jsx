// components/Button.js
import styled from "styled-components";

const Stepbardiv = styled.div`
  position: fixed;
  width: 300px;
  overflow-y: scroll;
  height: 100%;
  border-radius: 10px;
  left: ${(props) => (props.$isvisible ? "0px" : "-300px")};
  background-color: #fff;
  transition: transform 0.3s ease-in-out;
  z-index: 1;

  @media (max-width: 768px) {
    width: 250px;
    left: 0;
    transition: transform 0.1s ease-in-out;
    left: ${(props) => (props.$isvisible ? "0px" : "-250px")};
  }
`;

export default Stepbardiv;
