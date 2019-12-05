import Popup from "./Popup";
import SmartBar from "./SmartBar";
import ScrollBox from "./ScrollBox";
import Inline from "./Inline";
import FullPage from "./FullPage";

const formTypesMap = {
    // Popup
    1: Popup,
    // Inline
    2: Inline,
    // SmartBar
    3: SmartBar,
    // ScrollBox
    4: ScrollBox,
    // Fullpage
    5: FullPage,
}

export default formTypesMap;