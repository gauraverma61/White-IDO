import { injected } from "./connectors";

export enum ConnectorNames {
  Injected = "Injected",
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
};
