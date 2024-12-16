import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Diamond", (m) => {
  const diamond = m.contract("Diamond", []);

  return { diamond };
});
