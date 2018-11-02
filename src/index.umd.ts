// Adapter file that uses a commonJS export in order for webpack
// to be able to generate a proper UMD bundle.
// @see https://github.com/webpack/webpack/issues/3929#issuecomment-302848532

import PublicInterface from "../event-delegation.d";
import EventDelegation from "./index";

import IStatic = PublicInterface.Static;

declare const module: { exports: IStatic };
module.exports = EventDelegation;
