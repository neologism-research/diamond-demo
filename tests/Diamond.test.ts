import DiamondModule from "@/ignition/Diamond.ignition";
import FacetDemoIgnition from "@/ignition/FacetDemo.ignition";
import { FacetAction } from "@/types/facet-cut.type";
import chai, { expect } from "chai";
import chaiString from "chai-string";
import { ignition, viem } from "hardhat";
import { getContract, toFunctionSelector, zeroAddress } from "viem";

chai.use(chaiString);

describe("Diamond", function () {
  describe("Deployment", function () {
    it("Deploy Diamond", async function () {
      const { diamond } = await ignition.deploy(DiamondModule);

      console.log("Diamond deployed to:", diamond.address);
    });
  });

  describe("Diamond Cut", function () {
    it("[PASS] can add a diamond facet into the diamond", async function () {
      const [deployer] = await viem.getWalletClients();
      const { diamond } = await ignition.deploy(DiamondModule);
      const { facetDemo_v1_0 } = await ignition.deploy(FacetDemoIgnition);

      await diamond.write.setContractOwner([deployer.account.address]);

      const owner = await diamond.read.getOwner();
      expect(owner).to.be.equalIgnoreCase(deployer.account.address);

      await diamond.write.diamondCut([
        [
          {
            action: FacetAction.Add,
            facetAddress: facetDemo_v1_0.address,
            functionSelectors: facetDemo_v1_0.abi.map((item) =>
              toFunctionSelector(item),
            ),
          },
        ],
        zeroAddress,
        "0x",
      ]);

      const diamondWithFacetDemo = getContract({
        address: diamond.address,
        abi: facetDemo_v1_0.abi,
        client: deployer,
      });

      const value1_1 = await diamondWithFacetDemo.read.getValue1();
      expect(value1_1).to.equal(0n);

      await diamondWithFacetDemo.write.setValue1([1000n]);
      const value1_2 = await diamondWithFacetDemo.read.getValue1();
      expect(value1_2).to.equal(1000n);
    });

    it("[PASS] can replace a diamond facet with the existing diamond", async function () {
      const [deployer] = await viem.getWalletClients();
      const { diamond } = await ignition.deploy(DiamondModule);
      const { facetDemo_v1_0, facetDemo_v1_1 } =
        await ignition.deploy(FacetDemoIgnition);

      await diamond.write.setContractOwner([deployer.account.address]);

      const owner = await diamond.read.getOwner();
      expect(owner).to.be.equalIgnoreCase(deployer.account.address);

      // demo facet v1.0
      await diamond.write.diamondCut([
        [
          {
            action: FacetAction.Add,
            facetAddress: facetDemo_v1_0.address,
            functionSelectors: facetDemo_v1_0.abi.map((item) =>
              toFunctionSelector(item),
            ),
          },
        ],
        zeroAddress,
        "0x",
      ]);
      const diamondWithFacetDemo_v1_0 = getContract({
        address: diamond.address,
        abi: facetDemo_v1_0.abi,
        client: deployer,
      });
      await diamondWithFacetDemo_v1_0.write.setValue1([1000n]);
      const value1_1 = await diamondWithFacetDemo_v1_0.read.getValue1();
      expect(value1_1).to.equal(1000n);

      // demo facet v1.1
      await diamond.write.diamondCut([
        [
          {
            action: FacetAction.Replace,
            facetAddress: facetDemo_v1_1.address,
            functionSelectors: facetDemo_v1_1.abi.map((item) =>
              toFunctionSelector(item),
            ),
          },
        ],
        zeroAddress,
        "0x",
      ]);
      const diamondWithFacetDemo_v1_1 = getContract({
        address: diamond.address,
        abi: facetDemo_v1_1.abi,
        client: deployer,
      });
      // read the same value again
      const value1_2 = await diamondWithFacetDemo_v1_1.read.getValue1();
      expect(value1_2).to.equal(1000n);

      await diamondWithFacetDemo_v1_1.write.setValue1([1000n]);
      const value1_3 = await diamondWithFacetDemo_v1_1.read.getValue1();
      expect(value1_3).to.equal(2000n);
    });

    it("[PASS] can delete a diamond facet with the existing diamond", async function () {
      const [deployer] = await viem.getWalletClients();
      const { diamond } = await ignition.deploy(DiamondModule);
      const { facetDemo_v1_0 } = await ignition.deploy(FacetDemoIgnition);

      await diamond.write.setContractOwner([deployer.account.address]);

      const owner = await diamond.read.getOwner();
      expect(owner).to.be.equalIgnoreCase(deployer.account.address);

      // demo facet v1.0
      await diamond.write.diamondCut([
        [
          {
            action: FacetAction.Add,
            facetAddress: facetDemo_v1_0.address,
            functionSelectors: facetDemo_v1_0.abi.map((item) =>
              toFunctionSelector(item),
            ),
          },
        ],
        zeroAddress,
        "0x",
      ]);
      const diamondWithFacetDemo_v1_0 = getContract({
        address: diamond.address,
        abi: facetDemo_v1_0.abi,
        client: deployer,
      });
      await diamondWithFacetDemo_v1_0.write.setValue1([1000n]);
      const value1_1 = await diamondWithFacetDemo_v1_0.read.getValue1();
      expect(value1_1).to.equal(1000n);

      // remove the facet
      await diamond.write.diamondCut([
        [
          {
            action: FacetAction.Remove,
            facetAddress: zeroAddress,
            functionSelectors: facetDemo_v1_0.abi.map((item) =>
              toFunctionSelector(item),
            ),
          },
        ],
        zeroAddress,
        "0x",
      ]);

      await expect(
        diamondWithFacetDemo_v1_0.read.getValue1(),
      ).to.be.rejectedWith("Diamond: Function does not exist");
    });
  });
});
