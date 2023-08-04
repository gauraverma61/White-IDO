import * as React from "react";
import { useEffect } from "react";
// @ts-ignore
import Packery from "packery";
import { PackeryContext } from "./Context";
import { useResizeDetector } from "react-resize-detector";

type PackeryItem = any; // TODO

interface ContainerProps {
  initialGutter?: number;
  children: any;
}

export const PackeryContainer: React.FunctionComponent<ContainerProps> =
  React.memo((props: ContainerProps) => {
    const { width, ref: containerRef } = useResizeDetector();

    const [packeryInstance, setPackeryInstance] = React.useState<any>();
    useEffect(() => {
      if (packeryInstance) {
        setTimeout(() => {
          packeryInstance.layout();
        }, 100);
      }
    }, [packeryInstance, width]);
    console.log("render Container");

    React.useEffect(() => {
      if (window && containerRef) {
        //@ts-ignore
        const pckry = new Packery(containerRef.current, {
          itemSelector: ".grid-item",
          gutter: 5,
          // columnWidth: 600,
          // resize: true,
          // initLayout: false,
          // columnWidth: 400,
        });
        setPackeryInstance(pckry);
        // return () => pckry?.destroy();
      }
    }, []);

    useEffect(() => {
      if (packeryInstance) packeryInstance.reloadItems();
    }, [packeryInstance, props.children]);

    return (
      <PackeryContext.Provider value={{ packeryInstance }}>
        <div
          className={"grid-container"}
          style={{
            height: "500px",
          }}
          ref={containerRef}>
          {props.children}
        </div>
      </PackeryContext.Provider>
    );
  });

PackeryContainer.displayName = "PackeryContainer";
