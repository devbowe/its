const nome = document.querySelector("[data-field='nome']");
const email = document.querySelector("[data-field='email']");
const empresa = document.querySelector("[data-field='empresa']");
const telefone = document.querySelector("[data-field='telefone']");
const cargo = document.querySelector("[data-field='cargo']");
const segmento = document.querySelector("[data-field='segmento']");
const funcionarios = document.querySelector("[data-field='funcionarios']");
const faturamento = document.querySelector("[data-field='faturamento']");
const optin = document.querySelector("[data-field='opt-in']");

const utm_source = document.querySelector("input[name='utm_source']");
const utm_content = document.querySelector("input[name='utm_content']");
const utm_medium = document.querySelector("input[name='utm_medium']");
const utm_term = document.querySelector("input[name='utm_term']");
const utm_campaign = document.querySelector("input[name='utm_campaign']");
const url_pagina = document.querySelector("input[name='url_pagina']");

const formButton = document.querySelector(".form-btn");
const form = document.querySelector(".form");

const validationsMessages = {
    nome: "Digite seu nome",
    email: "Digite um email corporativo",
    empresa: "Digite o nome de sua empresa",
    telefone: "Insira um telefone válido",
    cargo: "Selecione seu cargo",
    segmento: "Selecione seu segmento",
    funcionarios: "Selecione o número de funcionários da empresa",
    faturamento: "Selecione o faturamento anual da empresa",
    optin: "Necessário dar ciência em receber comunicações",
};

// -------------------------  Form Validation -------------------------

formButton.addEventListener("click", function (e) {
    if (nome.value.trim() === "") {
        writeErrorMessage(nome, validationsMessages.nome);
        e.preventDefault();
    } else if (!validacaoEmail(email.value) || !emailCorporativo(email.value)) {
        writeErrorMessage(email, validationsMessages.email);
        e.preventDefault();
    } else if (empresa.value.trim() === "") {
        writeErrorMessage(empresa, validationsMessages.empresa);
        e.preventDefault();
    } else if (telefone.value.length !== 15) {
        writeErrorMessage(telefone, validationsMessages.telefone);
        e.preventDefault();
    } else if (cargo.value === "") {
        writeErrorMessage(cargo, validationsMessages.cargo);
        e.preventDefault();
    } else if (segmento.value === "") {
        writeErrorMessage(segmento, validationsMessages.segmento);
        e.preventDefault();
    } else if (funcionarios.value === "") {
        writeErrorMessage(funcionarios, validationsMessages.funcionarios);
        e.preventDefault();
    } else if (faturamento.value === "") {
        writeErrorMessage(faturamento, validationsMessages.faturamento);
        e.preventDefault();
    } else if (!optin.checked) {
        optin.parentElement.nextElementSibling.textContent =
            validationsMessages.optin;
        e.preventDefault();
    } else {
        formButton.textContent = "Enviando...";

        const sendRD = [
            { name: "identificador", value: "lp-s4hana-rd" },
            { name: "Nome", value: nome.value },
            { name: "email", value: email.value },
            { name: "Empresa", value: empresa.value },
            { name: "Telefone", value: telefone.value },
            { name: "Cargo", value: cargo.value },
            { name: "Segmento", value: segmento.value },
            { name: "Tamanho da empresa", value: funcionarios.value },
            { name: "Faturamento Anual", value: faturamento.value },
            { name: "utm_source", value: utm_source.value },
            { name: "utm_content", value: utm_content.value },
            { name: "utm_term", value: utm_term.value },
            { name: "utm_campaign", value: utm_campaign.value },
            { name: "utm_medium", value: utm_medium.value },
            { name: "url_pagina", value: url_pagina.value },
            {
                name: "token_rdstation",
                value: "0dd6780d343f40c2ad01b3ee63ea966f",
            },
            { name: "privacy_data[communications]", value: "1" },
        ];

        console.log(sendRD);
        RdIntegration.post(sendRD);

        setTimeout(function () {
            window.location.href = "./s4hana-obrigado.html";
        }, 1500);

        return true;
    }

    e.preventDefault();
    return false;
});

nome.addEventListener("blur", (e) => {
    if (nome.value.trim() !== "") {
        removeErrorMessage(nome);
    } else {
        writeErrorMessage(nome, validationsMessages.nome);
    }
});

email.addEventListener("blur", (e) => {
    if (validacaoEmail(email.value) && emailCorporativo(email.value)) {
        removeErrorMessage(email);
    } else {
        writeErrorMessage(email, validationsMessages.email);
    }
});

empresa.addEventListener("blur", (e) => {
    if (empresa.value.trim() !== "") {
        removeErrorMessage(empresa);
    } else {
        writeErrorMessage(empresa, validationsMessages.empresa);
    }
});

telefone.addEventListener("blur", (e) => {
    if (telefone.value.length === 15) {
        removeErrorMessage(telefone);
    } else {
        writeErrorMessage(telefone, validationsMessages.telefone);
    }
});

optin.addEventListener("change", (e) => {
    if (e.target.checked) {
        optin.parentElement.nextElementSibling.textContent = "";
    } else {
        optin.parentElement.nextElementSibling.textContent =
            validationsMessages.optin;
    }
});

const selectFieldToValidate = [cargo, segmento, funcionarios, faturamento];

selectFieldToValidate.forEach((select) => {
    select.addEventListener("change", (e) => {
        if (e.target.value !== "") {
            removeErrorMessage(select);
        } else {
            writeErrorMessage(
                select,
                validationsMessages[select.getAttribute("data-field")]
            );
        }
    });
});

function writeErrorMessage(field, message) {
    field.nextElementSibling.textContent = message;
}

function removeErrorMessage(field) {
    field.nextElementSibling.textContent = "";
}

// ------------------------- Phone Mask -------------------------
telefone.addEventListener("input", handlePhoneInput, false);

function handlePhoneInput(e) {
    e.target.value = phoneMask(e.target.value);
}

function phoneMask(phone) {
    return phone
        .replace(/\D/g, "")
        .replace(/^(\d)/, "($1")
        .replace(/^(\(\d{2})(\d)/, "$1) $2")
        .replace(/(\d{5})(\d{1,4})/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
}

// -------------------------  Email validation -------------------------
function validacaoEmail(email) {
    var verifica =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return verifica.test(String(email).toLowerCase());
}

function emailCorporativo(email) {
    const invalidDomains = [
        "@gmail.",
        "@yahoo.",
        "@hotmail.",
        "@live.",
        "@aol.",
        "@outlook.",
        "@terra.",
        "@bol.",
        "@uol.",
    ];

    for (let i = 0; i < invalidDomains.length; i++) {
        const domain = invalidDomains[i];
        if (email.indexOf(domain) != -1) {
            return false;
        }
    }
    return true;
}

//-------------------------  Change select field colors -------------------------
(() => {
    const selects = Array.from(document.querySelectorAll("select"));
    const CSS_VARIABLES = getComputedStyle(document.documentElement);
    const placeholderColor =
        CSS_VARIABLES.getPropertyValue("--clr-placeholder");
    const whiteColor = CSS_VARIABLES.getPropertyValue("--clr-neutral-white");

    selects.forEach((select) => {
        select.style.color = placeholderColor;

        select.addEventListener("change", (e) => {
            if (e.target.value === "") {
                select.style.color = placeholderColor;
            } else {
                select.style.color = whiteColor;
            }
        });
    });
})();

// -------------------------  Query UTM -------------------------
const queryForm = function (settings) {
    const reset = settings && settings.reset ? settings.reset : false;
    const self = window.location.toString();
    const querystring = self.split("?");
    if (querystring.length > 1) {
        const pairs = querystring[1].split("&");
        for (i in pairs) {
            var keyval = pairs[i].split("=");
            if (reset || sessionStorage.getItem(keyval[0]) === null) {
                sessionStorage.setItem(
                    keyval[0],
                    decodeURIComponent(keyval[1])
                );
            }
        }
    }
    const hiddenFields = document.querySelectorAll(
        "input[type=hidden], input[type=text]"
    );
    for (let i = 0; i < hiddenFields.length; i++) {
        const param = sessionStorage.getItem(hiddenFields[i].name);
        if (param)
            document.getElementsByName(hiddenFields[i].name)[0].value = param;
    }
};

queryForm();

//-------------------------  URL_PAGINA -------------------------
document.querySelector("input[name='url_pagina']").value =
    location.protocol + "//" + location.host + location.pathname;
