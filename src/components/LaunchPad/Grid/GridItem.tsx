import * as React from "react";
import { MouseEventHandler } from "react";
import styles from "./GridItem.module.scss";

interface GridItemProps {
  className?: string;
  children: any;
  onClick?: MouseEventHandler<any> | undefined;
}

export const gridItemClassName = styles.gridItem;
export const GridItem: React.FunctionComponent<GridItemProps> = React.memo(
  (props: GridItemProps) => {
    // const { packeryInstance } = React.useContext(PackeryContext);
    const itemRef = React.useRef<HTMLDivElement>(null);
    // React.useEffect(() => {
    //   if (packeryInstance) {
    //     const htmlElement = itemRef.current;
    //     const draggie = new Draggabilly(htmlElement, {
    //       handle: `.${styles.dragHandle}`,
    //     });
    //     packeryInstance.bindDraggabillyEvents(draggie);
    //     return () => {
    //       draggie.destroy();
    //       packeryInstance.remove(htmlElement);
    //     };
    //   }
    // }, [packeryInstance]);
    return (
      <div
        onClick={props.onClick}
        className={`grid-item ${props.className || ""}`}
        ref={itemRef}>
        {props.children}
      </div>
    );
  }
);

GridItem.displayName = "GridItem";
