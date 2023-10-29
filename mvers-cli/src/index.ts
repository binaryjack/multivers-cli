#! /usr/bin/env node
import { buildDependencyCommand } from './commands/buildDependencies.js'
import { buildCommand } from './commands/buildRoot.js'
import { clearCommand } from './commands/clearFiles.js'
import { clearVCommand } from './commands/clearVersion.js'
import { mainProgram } from './commands/commandsInit.js'
import { currentVCommand } from './commands/getCurrentVersion.js'
import { initConfig } from './commands/initLocalSettings.js'
import { testProgress } from './commands/testProgress.js'
import { updateCommand } from './commands/updateFiles.js'
import { versionSwitchCommand } from './commands/versionSwitch.js'

buildDependencyCommand(mainProgram)
buildCommand(mainProgram)
versionSwitchCommand(mainProgram)
updateCommand(mainProgram)
currentVCommand(mainProgram)
clearVCommand(mainProgram)
clearCommand(mainProgram)
buildCommand(mainProgram)
initConfig(mainProgram)
testProgress(mainProgram)

mainProgram.parse()
