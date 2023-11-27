/* IMPORT NODE MODULES
================================================== */
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

/* IMPORT CONSTANTS AND UTILS
================================================== */
import {
    type IssueIdArgs,
    ProofOfIdTest,
    userType,
    UserTypeKey,
} from "./proof-of-identity/setup";
import { ZERO_ADDRESS } from "./constants";
import { addTime } from "@utils/time";
import { getH1Balance, parseH1 } from "@utils/token";
import { PROOF_OF_ID_ATTRIBUTES } from "@utils/deploy/proof-of-identity";
import { tsFromTxRec } from "@utils/transaction";

const exp = addTime(Date.now(), 2, "years", "sec");

function newArgs(addr: string, countryCode: string = "ng", userTypeKey: UserTypeKey = "RETAIL"): IssueIdArgs {
    return {
        account: addr,
        userType: userType(userTypeKey),
        proofOfLiveliness: true,
        primaryID: true,
        countryCode,
        expiries: [exp, exp, exp, exp],
        tokenURI: "test-uri",
    };
}

/* TESTS
================================================== */
describe("Air Drop Test", function () {

    async function setup() {

        const [user1, user2, user3, user4, user5, user6, user7, user8] = await ethers.getSigners();

        const poi = await ProofOfIdTest.create();

        const MOCKERC20 = await ethers.deployContract("MockERC20");

        const mockERC20Addr = await MOCKERC20.getAddress();

        const AirDrop = await ethers.getContractFactory("AirDrop");

        const airDrop = await AirDrop.deploy(poi.proofOfIdContractAddress);

        await poi.issueIdentity(newArgs(user1.address));

        await poi.issueIdentity(newArgs(user2.address));

        await poi.issueIdentity(newArgs(user3.address));

        await poi.issueIdentity(newArgs(user4.address));

        return { poi, airDrop, MOCKERC20, mockERC20Addr, user1, user2, user3, user4, user5, user6, user7, user8 };
    }

    /* Deployment
    ======================================== */
    describe("Deployment", async function () {

        it("Should set the right Proof Of Identity Address", async() => {
            const { airDrop, poi } = await loadFixture(setup);
            expect(await airDrop.proofOfIdentity()).to.be.equal(poi.proofOfIdContractAddress);
        });

        it("User 1, 2, 3, and 4 should have IDs", async() => {
            const { airDrop, user1, user2, user3, user4 } = await loadFixture(setup);
            expect(await airDrop.hasID(user1.address)).to.be.true;
            expect(await airDrop.hasID(user2.address)).to.be.true;
            expect(await airDrop.hasID(user3.address)).to.be.true;
            expect(await airDrop.hasID(user4.address)).to.be.true;
        });

        it("User 5, 6, 7, and 8 should not have IDs", async() => {
            const { airDrop, user5, user6, user7, user8 } = await loadFixture(setup);
            expect(await airDrop.hasID(user5.address)).to.be.false;
            expect(await airDrop.hasID(user6.address)).to.be.false;
            expect(await airDrop.hasID(user7.address)).to.be.false;
            expect(await airDrop.hasID(user8.address)).to.be.false;
        });

    });

    /* doAirDrop
    ======================================== */
    describe("doAirDrop", async function () {

        it("Should send tokens to user 1, 2, 3, and 4", async() => {

            const { airDrop, MOCKERC20, mockERC20Addr, user1, user2, user3, user4 } = await loadFixture(setup);

            await MOCKERC20.approve(await airDrop.getAddress(), BigInt("100000000000000000"));

            const amount = BigInt("1000000000000000");

            await airDrop.doAirDrop(mockERC20Addr, [user1, user2, user3, user4], amount);

            //expect(await MOCKERC20.balanceOf(user1.address)).to.be.equal(amount);

            expect(await MOCKERC20.balanceOf(user2.address)).to.be.equal(amount);

            expect(await MOCKERC20.balanceOf(user3.address)).to.be.equal(amount);

            expect(await MOCKERC20.balanceOf(user4.address)).to.be.equal(amount);

        });


        it("Should not send tokens to user 5, 6, 7, and 8, because they lack ID", async() => {

            const { airDrop, MOCKERC20, mockERC20Addr, user5, user6, user7, user8 } = await loadFixture(setup);

            await MOCKERC20.approve(await airDrop.getAddress(), BigInt("100000000000000000"));

            const amount = BigInt("1000000000000000");

            await airDrop.doAirDrop(mockERC20Addr, [user5, user6, user7, user8], amount);

            expect(await MOCKERC20.balanceOf(user5.address)).to.be.equal(0n);

            expect(await MOCKERC20.balanceOf(user6.address)).to.be.equal(0n);

            expect(await MOCKERC20.balanceOf(user7.address)).to.be.equal(0n);

            expect(await MOCKERC20.balanceOf(user8.address)).to.be.equal(0n);

        });

        it("Should send tokens to user 2 and 4, but not 6 and 8, because they lack ID", async() => {

            const { airDrop, MOCKERC20, mockERC20Addr, user2, user4, user6, user8 } = await loadFixture(setup);

            await MOCKERC20.approve(await airDrop.getAddress(), BigInt("100000000000000000"));

            const amount = BigInt("1000000000000000");

            await airDrop.doAirDrop(mockERC20Addr, [user2, user4, user6, user8], amount);

            expect(await MOCKERC20.balanceOf(user2.address)).to.be.equal(amount);

            expect(await MOCKERC20.balanceOf(user4.address)).to.be.equal(amount);

            expect(await MOCKERC20.balanceOf(user6.address)).to.be.equal(0n);

            expect(await MOCKERC20.balanceOf(user8.address)).to.be.equal(0n);

        });

    });

    /* Starting an Auction
    ======================================== */
    describe("doAirDropByCountry", function () {
        
    });

    
    /* Misc
    ======================================== */
    describe("Misc", function () {

    });
});
