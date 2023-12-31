"use strict";
/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
Object.defineProperty(exports, "__esModule", {
    value: true
});
const abi_1 = require("@ethersproject/abi");
const ethersAbiCoder = new abi_1.AbiCoder((_, value) => {
    if (value === null || value === void 0 ? void 0 : value._isBigNumber) {
        return value.toBigInt();
    }
    // Because of tye type def from @ethersproject/abi
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return value;
});
exports.default = ethersAbiCoder;
//# sourceMappingURL=ethers_abi_coder.js.map