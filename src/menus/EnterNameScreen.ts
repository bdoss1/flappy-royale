import * as Phaser from "phaser"
import _ = require("lodash")
import { changeSettings } from "../user/userManager"
import { usernameIsValid } from "../usernameIsValid"
import { analyticsSetID } from "../nativeComms/analytics"

export const NamePromptKey = "EnterName"

export class EnterNameScreen extends Phaser.Scene {
    completion: (name?: string) => void
    showCancelButton: boolean

    constructor(showCancelButton: boolean, completion: (name: string) => void) {
        super(NamePromptKey)
        this.completion = completion
        this.showCancelButton = showCancelButton
    }

    preload() {
        this.load.html("NameForm", require("../../assets/html/NameForm.html"))
    }

    create() {
        // Make a HTML form
        const el = this.add
            .dom(0, 0)
            .setOrigin(0, 0)
            .createFromCache("NameForm")

        const normalButton = require("../../assets/menu/ButtonSmallBG.png")
        const yellowButton = require("../../assets/menu/ButtonSmallBG-Yellow.png")
        const disabledButton = require("../../assets/menu/ButtonSmallBG-Disabled.png")

        const buttonBG = document.getElementById("ok-button-bg") as HTMLImageElement
        buttonBG.src = disabledButton
        const okButtonBG = this.showCancelButton ? yellowButton : normalButton

        const cancelButtonBG = document.getElementById("cancel-button-bg") as HTMLImageElement
        cancelButtonBG.src = normalButton

        const usernameInput = document.getElementById("username") as HTMLInputElement
        const button = document.getElementById("ok-button") as HTMLButtonElement
        button.disabled = true

        const cancelButton = document.getElementById("cancel-button") as HTMLButtonElement

        if (!this.showCancelButton) {
            cancelButton.classList.add("hidden")
        }

        const validateName = () => {
            const name = usernameInput.value

            if (usernameIsValid(name)) {
                usernameInput.style.border = "none"
                button.disabled = false
                buttonBG.src = okButtonBG
            } else {
                usernameInput.style.border = "2px red solid"
                button.disabled = true
                buttonBG.src = disabledButton
            }
        }

        document.addEventListener("keyup", validateName)

        document.getElementById("username")!.focus()
        button.addEventListener("click", () => {
            const name = usernameInput.value
            if (!usernameIsValid(name)) {
                return
            }

            // We have code in place to fix scroll placement on blur,
            // but manually triggering window.blur() or usernameInput.blur() doesn't fire it
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })

            changeSettings({ name })
            analyticsSetID(name)

            this.completion(name)
        })

        cancelButton.addEventListener("click", () => {
            this.completion(undefined)
        })
    }
}
