import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FacetDemo", (m) => {
  const facetDemo_v1_0 = m.contract("FacetDemo_v1_0", []);
  const facetDemo_v1_1 = m.contract("FacetDemo_v1_1", []);

  return { facetDemo_v1_0, facetDemo_v1_1 };
});
