/* eslint-disable @typescript-eslint/no-explicit-any */
import { runner } from "./runner"
import config from "../config.js"

runner(
    config['server'] as any, 
    config['sign'] as any
)
