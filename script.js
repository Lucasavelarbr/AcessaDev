const menuToggle = document.getElementById('menu-toggle')
const navList = document.getElementById('nav-list')

const openMenu = () =>{
    navList.classList.add('active')
    menuToggle.classList.add('active')
    navList.removeAttribute("hidden")
    navList.removeAttribute("inert")
    menuToggle.setAttribute("aria-expanded", "true")
}

const closeMenu = () =>{
    navList.classList.remove('active')
    menuToggle.classList.remove('active')
    navList.setAttribute("hidden")
    navList.setAttribute("inert")
    menuToggle.setAttribute("aria-expanded", "true")
}

menuToggle.addEventListener('click', (e) =>{
    e.stopPropagation()

    const isOpen = navList.classList.contains('active')

    if (isOpen){
        closeMenu()
    }else(
        openMenu()
    )
})

// fechar com o Esc

document.addEventListener('keydown', (e) =>{
    if (e.key === "Escape"){
        closeMenu()
    }
})

// Clicar fora

document.addEventListener ("click", (e) =>{
    const ClickMenu = navList.contains(e.target)
    const ClickBotao = menuToggle.contains(e.target)

    if (!ClickBotao && !ClickMenu){
        closeMenu()
    }
})

/* =========================================
   ELEMENTOS
========================================= */

const textColor = document.querySelector("#text-color");
const textHex = document.querySelector("#text-hex");

const backgroundColor =
    document.querySelector("#background-color");

const backgroundHex =
    document.querySelector("#background-hex");

const swapButton =
    document.querySelector("#swap-colors");

const contrastRatio =
    document.querySelector("#contrast-ratio");

const contrastLevel =
    document.querySelector("#contrast-level");

const resultMessage =
    document.querySelector("#result-message");

const resultDescription =
    document.querySelector("#result-description");

const preview =
    document.querySelector("#preview");

const textError =
    document.querySelector("#text-error");

const backgroundError =
    document.querySelector("#background-error");


/* =========================================
   RESULTADOS WCAG
========================================= */

const normalAA =
    document.querySelector("#normal-aa");

const normalAAA =
    document.querySelector("#normal-aaa");

const normalCheck =
    document.querySelector("#normal-check");

const largeAA =
    document.querySelector("#large-aa");

const largeAAA =
    document.querySelector("#large-aaa");

const largeCheck =
    document.querySelector("#large-check");

const uiAA =
    document.querySelector("#ui-aa");

const uiCheck =
    document.querySelector("#ui-check");


/* =========================================
   VALIDAR HEX
========================================= */

function isValidHex(value) {

    return /^#([A-Fa-f0-9]{6})$/.test(value);

}


/* =========================================
   HEX → RGB
========================================= */

function hexToRgb(hex) {

    return {

        r: parseInt(hex.substring(1, 3), 16),

        g: parseInt(hex.substring(3, 5), 16),

        b: parseInt(hex.substring(5, 7), 16)

    };

}


/* =========================================
   LUMINÂNCIA RELATIVA
========================================= */

function getLuminance(hex) {

    const rgb = hexToRgb(hex);


    const channels = [
        rgb.r,
        rgb.g,
        rgb.b
    ].map(value => value / 255);


    const linearChannels =
        channels.map(value => {

            if (value <= 0.04045) {

                return value / 12.92;

            }

            return Math.pow(
                (value + 0.055) / 1.055,
                2.4
            );

        });


    return (
        (0.2126 * linearChannels[0]) +
        (0.7152 * linearChannels[1]) +
        (0.0722 * linearChannels[2])
    );

}


/* =========================================
   RAZÃO DE CONTRASTE
========================================= */

function calculateContrast(text, background) {

    const textLuminance =
        getLuminance(text);

    const backgroundLuminance =
        getLuminance(background);


    const lighter =
        Math.max(
            textLuminance,
            backgroundLuminance
        );

    const darker =
        Math.min(
            textLuminance,
            backgroundLuminance
        );


    return (
        (lighter + 0.05) /
        (darker + 0.05)
    );

}


/* =========================================
   ATUALIZAR STATUS
========================================= */

function updateStatus(element, passed) {

    element.classList.toggle(
        "passed",
        passed
    );

    element.classList.toggle(
        "failed",
        !passed
    );

}


/* =========================================
   ATUALIZAR ÍCONE DE CHECK
========================================= */

function updateCheck(element, passed) {

    element.hidden = !passed;

}


/* =========================================
   ATUALIZAR RESULTADO
========================================= */

function updateResult() {

    const text =
        textHex.value.trim().toUpperCase();

    const background =
        backgroundHex.value.trim().toUpperCase();


    /* -----------------------------
       VALIDAÇÃO
    ----------------------------- */

    let valid = true;


    if (!isValidHex(text)) {

        textError.textContent =
            "Digite uma cor hexadecimal válida. Exemplo: #1A1A1A";

        valid = false;

    } else {

        textError.textContent = "";

    }


    if (!isValidHex(background)) {

        backgroundError.textContent =
            "Digite uma cor hexadecimal válida. Exemplo: #FFFFFF";

        valid = false;

    } else {

        backgroundError.textContent = "";

    }


    if (!valid) {

        return;

    }


    /* -----------------------------
       CONTRASTE
    ----------------------------- */

    const ratio =
        calculateContrast(
            text,
            background
        );


    contrastRatio.textContent =
        `${ratio.toFixed(2)}:1`;


    /* -----------------------------
       CRITÉRIOS WCAG
    ----------------------------- */

    const normalAAPassed =
        ratio >= 4.5;

    const normalAAAPassed =
        ratio >= 7;

    const largeAAPassed =
        ratio >= 3;

    const largeAAAPassed =
        ratio >= 4.5;

    const uiPassed =
        ratio >= 3;


    /* -----------------------------
       STATUS
    ----------------------------- */

    updateStatus(
        normalAA,
        normalAAPassed
    );

    updateStatus(
        normalAAA,
        normalAAAPassed
    );

    updateStatus(
        largeAA,
        largeAAPassed
    );

    updateStatus(
        largeAAA,
        largeAAAPassed
    );

    updateStatus(
        uiAA,
        uiPassed
    );


    /* -----------------------------
       CHECKS
    ----------------------------- */

    updateCheck(
        normalCheck,
        normalAAPassed
    );

    updateCheck(
        largeCheck,
        largeAAPassed
    );

    updateCheck(
        uiCheck,
        uiPassed
    );


    /* -----------------------------
       RESULTADO GERAL
    ----------------------------- */

    if (ratio >= 7) {

        contrastLevel.textContent =
            "AAA";

        contrastLevel.style.backgroundColor =
            "#DDF8E8";

        contrastLevel.style.color =
            "#087443";

        resultMessage.textContent =
            "Contraste excelente!";

        resultDescription.textContent =
            "Essa combinação atende aos requisitos WCAG 2.2 para todos os níveis.";

    }

    else if (ratio >= 4.5) {

        contrastLevel.textContent =
            "AA";

        contrastLevel.style.backgroundColor =
            "#DDF8E8";

        contrastLevel.style.color =
            "#087443";

        resultMessage.textContent =
            "Contraste muito bom!";

        resultDescription.textContent =
            "Essa combinação atende aos requisitos AA para texto normal e AAA para texto grande.";

    }

    else if (ratio >= 3) {

        contrastLevel.textContent =
            "AA";

        contrastLevel.style.backgroundColor =
            "#FFF3CD";

        contrastLevel.style.color =
            "#7A4D00";

        resultMessage.textContent =
            "Contraste adequado para textos grandes.";

        resultDescription.textContent =
            "Essa combinação atende aos requisitos para texto grande e elementos gráficos, mas não para texto normal.";

    }

    else {

        contrastLevel.textContent =
            "Não atende";

        contrastLevel.style.backgroundColor =
            "#FDE8E8";

        contrastLevel.style.color =
            "#B42318";

        resultMessage.textContent =
            "Contraste insuficiente.";

        resultDescription.textContent =
            "Essa combinação não atende aos requisitos mínimos de contraste da WCAG 2.2.";

    }


    /* -----------------------------
       PRÉ-VISUALIZAÇÃO
    ----------------------------- */

    preview.style.color =
        text;

    preview.style.backgroundColor =
        background;

}


/* =========================================
   COLOR PICKER → HEX
========================================= */

textColor.addEventListener(
    "input",
    () => {

        textHex.value =
            textColor.value.toUpperCase();

        updateResult();

    }
);


backgroundColor.addEventListener(
    "input",
    () => {

        backgroundHex.value =
            backgroundColor.value.toUpperCase();

        updateResult();

    }
);


/* =========================================
   HEX → COLOR PICKER
========================================= */

textHex.addEventListener(
    "input",
    () => {

        textHex.value =
            textHex.value
                .toUpperCase()
                .replace(/[^#A-F0-9]/g, "");

        if (isValidHex(textHex.value)) {

            textColor.value =
                textHex.value;

            updateResult();

        }

    }
);


backgroundHex.addEventListener(
    "input",
    () => {

        backgroundHex.value =
            backgroundHex.value
                .toUpperCase()
                .replace(/[^#A-F0-9]/g, "");

        if (isValidHex(backgroundHex.value)) {

            backgroundColor.value =
                backgroundHex.value;

            updateResult();

        }

    }
);


/* =========================================
   TROCAR CORES
========================================= */

swapButton.addEventListener(
    "click",
    () => {

        const currentText =
            textHex.value;

        const currentBackground =
            backgroundHex.value;


        textHex.value =
            currentBackground;

        backgroundHex.value =
            currentText;


        textColor.value =
            currentBackground;

        backgroundColor.value =
            currentText;


        updateResult();

    }
);


/* =========================================
   COPIAR HEX
========================================= */

document
    .querySelectorAll(".copy-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const inputId =
                    button.dataset.copy;

                const input =
                    document.getElementById(inputId);


                try {

                    await navigator.clipboard.writeText(
                        input.value
                    );


                    const icon =
                        button.querySelector("i");


                    icon.className =
                        "bi bi-check-lg";


                    button.setAttribute(
                        "aria-label",
                        "Código copiado"
                    );


                    setTimeout(
                        () => {

                            icon.className =
                                "bi bi-copy";

                            button.setAttribute(
                                "aria-label",
                                "Copiar código da cor"
                            );

                        },
                        1500
                    );


                } catch (error) {

                    console.error(
                        "Erro ao copiar:",
                        error
                    );

                }

            }
        );

    });


/* =========================================
   BLUR DOS CAMPOS HEX
========================================= */

textHex.addEventListener(
    "blur",
    () => {

        if (!isValidHex(textHex.value)) {

            textError.textContent =
                "Digite uma cor hexadecimal válida.";

            return;

        }

        textError.textContent = "";

        textHex.value =
            textHex.value.toUpperCase();

    }
);


backgroundHex.addEventListener(
    "blur",
    () => {

        if (!isValidHex(backgroundHex.value)) {

            backgroundError.textContent =
                "Digite uma cor hexadecimal válida.";

            return;

        }

        backgroundError.textContent = "";

        backgroundHex.value =
            backgroundHex.value.toUpperCase();

    }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

updateResult();