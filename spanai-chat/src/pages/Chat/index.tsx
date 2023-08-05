import { Content } from "./Content";
import { SideBar } from "./SideBar";
import "./container.scss";

export default function Chat() {
  return (
    <div className="container">
      <SideBar />
      <Content />
    </div>
  );
}
