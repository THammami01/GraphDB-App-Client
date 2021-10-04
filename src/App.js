import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  NavPane,
  NavPaneItem,
  Text,
  // Button,
  // ProgressCircle,
  // TextInput,
} from "react-desktop/windows";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptopHouse,
  faProjectDiagram,
  // faInfoCircle,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
import { ScrollTop } from "primereact/scrolltop";

import * as Views from "./views";
import {
  setIsNavExpanded,
  setSelectedNav,
} from "./store/actions/action-creators";

const App = () => {
  const dispatch = useDispatch();
  const isNavExpanded = useSelector((store) => store.global.isNavExpanded);
  const selectedNav = useSelector((store) => store.global.selectedNav);
  const isConnected = useSelector((store) => store.global.isConnected);

  useEffect(() => {
    const navs = document.querySelectorAll(
      "#root > div > div > div:nth-child(1) > a"
    );

    if (isConnected) {
      navs[0].style.display = "none";
      navs[1].style.display = "flex";
      navs[2].style.display = "flex";
    } else {
      navs[0].style.display = "flex";
      navs[1].style.display = "none";
      navs[2].style.display = "none";
    }
  }, [isConnected]);

  const renderItem = (title, content) => {
    return (
      <NavPaneItem
        title={title}
        icon={renderIcon(title)}
        color="#000000"
        background="#ffffff"
        theme="dark"
        selected={selectedNav === title}
        onSelect={() => dispatch(setSelectedNav(title))}
        padding="10px 20px"
        push
      >
        <Text color="#000000" background="#ffffff" theme="dark">
          {content}
        </Text>
      </NavPaneItem>
    );
  };

  const renderIcon = (name) => {
    switch (name) {
      case "Home":
        return <FontAwesomeIcon icon={faLaptopHouse} />;
      case "Graph Database":
        return <FontAwesomeIcon icon={faProjectDiagram} />;
      case "Cypher Queries":
        return <FontAwesomeIcon icon={faTerminal} />;
      default:
        break;
    }
  };

  return (
    <View color="#000000" style={{ minHeight: "100vh" }} background="#000000">
      <NavPane
        openLength={200}
        push
        color="#cc7f29"
        theme="dark"
        defaultIsPaneExpanded={isNavExpanded}
        onPaneToggle={() => dispatch(setIsNavExpanded())}
      >
        {renderItem("Home", <Views.Home />)}
        {renderItem("Graph Database", <Views.GraphDB />)}
        {renderItem("Cypher Queries", <Views.Queries />)}
      </NavPane>

      <ScrollTop style={{ right: "calc(100vw / 18)" }} />
    </View>
  );
};

export default App;
