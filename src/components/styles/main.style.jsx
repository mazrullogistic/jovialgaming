// components/Button.js
import styled from "styled-components";

const MainDiv = styled.div`
  margin-left: ${(props) => (props.$isvisible ? "320px" : "0")};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0px;
    transition: margin-left 0.1s ease-in-out;
  }
`;

export default MainDiv;
