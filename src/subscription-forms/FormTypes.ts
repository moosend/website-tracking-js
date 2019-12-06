import Popup from "./Popup";
import Row from "./Row";
import ScrollBox from "./ScrollBox";
import Inline from "./Inline";
import FullPage from "./FullPage";

const formTypesMap = {
    // Popup
    1: Popup,
    // Inline
    2: Inline,
    // Row
    3: Row,
    // ScrollBox
    4: ScrollBox,
    // Fullpage
    5: FullPage,
}

export default formTypesMap;