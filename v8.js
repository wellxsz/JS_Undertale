const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Definição de itens (armas, armaduras)

const graveto = { nome: "Graveto", tipo: "arma", dano: 1, descricao: "Um graveto simples. Causa dano mínimo, mas tem um crítico de 20." };
const faquinha = { nome: "Faca de Brinquedo", tipo: "arma", dano: 4, descricao: "Feita de plástico. Uma raridade hoje em dia." };
const luva = { nome: "Luva Forte", tipo: "arma", dano: 6, descricao: "Uma luva de couro rosa usada. Para pessoas de cinco-dedos." };
const sapatos = { nome: "Sapatos de Balé", tipo: "arma", dano: 8, descricao: "Estes sapatos usados fazem você se sentir incrivelmente perigoso." };
const caderno = { nome: "Caderno Rasgado", tipo: "arma", dano: 3, descricao: "Contém rabiscos ilegíveis." };
const frigideira = { nome: "Frigideira Queimada", tipo: "arma", dano: 11, descricao: "Dano é bem consistente." };
const armaVazia = { nome: "Arma Vazia", tipo: "arma", dano: 13, descricao: "Um revólver antigo. Não tem munição." };
const adaga = { nome: "Adaga Enferrujada", tipo: "arma", dano: 16, descricao: "Perfeita pra cortar plantas e vinhas." };
const facaReal = { nome: "Faca Real", tipo: "arma", dano: 100, descricao: "Aqui estamos nós!" };

const bandagem = { nome: "Bandagem", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const fita = { nome: "Fita desbotada", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const bandana = { nome: "Bandana Viril", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const tutu = { nome: "Tutu Velho", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const oculos = { nome: "Óculos Turvos", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const armaduraTemmie = { nome: "Armadura Temmie", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const avental = { nome: "Avental Sujo", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const chapeu = { nome: "Chapéu de Cowboy", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const pingenteCor = { nome: "Pingente de Coração", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };
const thePingent = { nome: "O Pingente", tipo: "armadura", def: 1, descricao: "Já foi usado várias vezes." };

// Classe Personagem
class Personagem {
    constructor(nome, armas = {}, armaduras = {}) {
        this.nome = nome;
        this.nivel = 1;
        this.hp = 20;
        this.at = 1;
        this.df = 2;
        this.experience = 0;
        this.experienceParaProximoLV = 10;
        this.inventario = [];

        // Usando armas e armaduras passadas no construtor
        this.itensEquipados = {
            arma: armas.graveto || null,  // Garantindo que 'graveto' esteja acessado corretamente
            armadura: armaduras.bandagem || null  // Garantindo que 'bandagem' esteja acessada corretamente
        };

        this.salaAtual = null;
        this.times_seen_flowey = 0;
    }

    levelUp() {
        this.nivel++;
        this.hp += 4;
        this.at += (this.nivel < 5) ? 2 : 0;
        this.df += (this.nivel >= 5) ? 1 : 0;
        this.experienceParaProximoLV = this.calculateExpForNextLevel();
    }

    calculateExpForNextLevel() {
        const expTable = [
            10, 20, 40, 50, 80, 100, 200, 300, 400, 500, 800,
            1000, 1500, 2000, 3000, 5000, 10000, 25000, 49999, null
        ];
        return expTable[this.nivel - 1];
    }

    receberDano(dano) {
        this.hp -= dano;
        if (this.hp < 0) this.hp = 0;
        console.log(`${this.nome} recebeu ${dano} de dano. HP atual: ${this.hp}`);
    }

    adicionarItem(item) {
        this.inventario.push(item);
        console.log(`${item.nome} adicionado ao inventário.`);
    }

    mostrarInventario() {
        console.log("Inventário:");
        this.inventario.forEach((item, index) => {
            console.log(`${index + 1}. ${item.nome} (Tipo: ${item.tipo})`);
        });
        console.log("Equipados:");
        console.log(`Arma: ${this.itensEquipados.arma ? this.itensEquipados.arma.nome : "Nenhuma"}`);
        console.log(`Armadura: ${this.itensEquipados.armadura ? this.itensEquipados.armadura.nome : "Nenhuma"}`);
    }

    inspecionarItem(index) {
        if (this.inventario[index]) {
            console.log(`Inspecionando ${this.inventario[index].nome}: ${this.inventario[index].descricao}`);
        } else {
            console.log("Item não encontrado.");
        }
    }

    equiparItem(index) {
        const item = this.inventario[index];
        if (item) {
            if (item.tipo === 'arma') {
                this.itensEquipados.arma = item;
                console.log(`${item.nome} equipada como arma.`);
            } else if (item.tipo === 'armadura') {
                this.itensEquipados.armadura = item;
                console.log(`${item.nome} equipada como armadura.`);
                if (item.nome === "Bandagem") {
                    const curaItem = { nome: "Bandagem", tipo: "cura", descricao: "Uma bandagem para recuperar um pouco de HP." };
                    this.inventario.push(curaItem);
                    console.log("A bandagem foi convertida em um item de cura.");
                }
            } else {
                console.log("Tipo de item não pode ser equipado.");
            }
        } else {
            console.log("Item não encontrado.");
        }
    }

    save() {
        const saveData = {
            nome: this.nome,
            nivel: this.nivel,
            hp: this.hp,
            at: this.at,
            df: this.df,
            experience: this.experience,
            inventario: this.inventario,
            itensEquipados: this.itensEquipados,
            salaAtual: this.salaAtual,
            flowey: this.times_seen_flowey
        };
        fs.writeFileSync('save.json', JSON.stringify(saveData, null, 2)); // Adicionando a formatação
        console.log("Jogo salvo com sucesso!");
    }

    static load() {
        const data = JSON.parse(fs.readFileSync('save.json', 'utf-8'));
        const armas = { graveto, faquinha, luva, sapatos, caderno, frigideira, armaVazia, adaga, facaReal };
        const armaduras = { bandagem, fita, bandana, tutu, oculos, armaduraTemmie, avental, chapeu, pingenteCor, thePingent };

        const personagem = new Personagem(data.nome, armas, armaduras);  // Passando armas e armaduras ao carregar
        personagem.nivel = data.nivel;
        personagem.hp = data.hp;
        personagem.at = data.at;
        personagem.df = data.df;
        personagem.experience = data.experience;
        personagem.inventario = data.inventario;
        personagem.itensEquipados = data.itensEquipados;
        personagem.salaAtual = data.salaAtual;
        personagem.times_seen_flowey = data.times_seen_flowey;
        return personagem;
    }
}

// Função para verificar se existe um save
function verificarSave() {
    if (fs.existsSync('save.json')) {
        console.log("Um arquivo de salvamento foi encontrado.");
        console.log("1. Carregar o jogo salvo");
        console.log("2. Excluir o jogo salvo e começar um novo");

        readline.question("Escolha uma opção: ", (opcao) => {
            if (opcao === '1') {
                const personagem = Personagem.load(armas, armaduras); // Passando armas e armaduras
                console.log(`Jogo carregado! Bem-vindo de volta, ${personagem.nome}!`);
                readline.close();
            } else if (opcao === '2') {
                fs.unlinkSync('save.json');
                console.log("Arquivo de salvamento excluído.");
                readline.close();
            } else {
                console.log("Opção inválida. Tente novamente.");
                verificarSave();
            }
        });
    } else {
        console.log("Nenhum jogo salvo encontrado.");
        readline.close();
    }
}

// Função para verificar se existe um save
function verificarSave() {
    if (fs.existsSync('save.json')) {
        console.log("Um arquivo de salvamento foi encontrado.");
        console.log("1. Carregar o jogo salvo");
        console.log("2. Excluir o jogo salvo e começar um novo");

        readline.question("Escolha uma opção: ", (opcao) => {
            if (opcao === '1') {
                const personagem = Personagem.load(armas, armaduras); // Passando armas e armaduras
                console.log(`Jogo carregado! Bem-vindo de volta, ${personagem.nome}!`);
                readline.close();
            } else if (opcao === '2') {
                fs.unlinkSync('save.json');
                console.log("Arquivo de salvamento excluído.");
                readline.close();
            } else {
                console.log("Opção inválida. Tente novamente.");
                verificarSave();
            }
        });
    } else {
        console.log("Nenhum jogo salvo encontrado.");
        readline.close();
    }
}

function verificarSave() {
    if (fs.existsSync('save.json')) {
        console.log("Um arquivo de salvamento foi encontrado.");
        console.log("1. Carregar o jogo salvo");
        console.log("2. Excluir o jogo salvo e começar um novo");

        readline.question("Escolha uma opção (1 ou 2): ", function(opcao) {
            if (opcao === "1") {
                const personagem = Personagem.load(armas, armaduras);
                console.log("Jogo carregado!");
                personagem.mostrarInventario();
                readline.close();
            } else if (opcao === "2") {
                fs.unlinkSync('save.json');
                console.log("Jogo salvo excluído. Começando um novo jogo.");
                const nomePersonagem = "Novo Jogador"; // Pode ser personalizado
                const novoPersonagem = new Personagem(nomePersonagem, armas, armaduras);
                novoPersonagem.mostrarInventario();
                readline.close();
            } else {
                console.log("Opção inválida.");
                readline.close();
            }
        });
    } else {
        console.log("Nenhum arquivo de salvamento encontrado.");
        const nomePersonagem = "Novo Jogador"; // Pode ser personalizado
        const novoPersonagem = new Personagem(nomePersonagem, armas, armaduras);
        novoPersonagem.mostrarInventario();
        readline.close();
    }
}

// Função para verificar e carregar o jogo salvo
function verificarSave() {
    if (fs.existsSync('save.json')) {
        console.log("Um arquivo de salvamento foi encontrado.");
        console.log("1. Carregar o jogo salvo");
        console.log("2. Excluir o jogo salvo e começar um novo");

        readline.question("Escolha uma opção (1 ou 2): ", function(opcao) {
            if (opcao === "1") {
                const personagem = Personagem.load();
                console.log("Jogo carregado!");
                personagem.mostrarInventario();
                readline.close();
            } else if (opcao === "2") {
                fs.unlinkSync('save.json');
                console.log("Jogo salvo excluído. Começando um novo jogo.");
                const nomePersonagem = "Novo Jogador"; // Pode ser personalizado
                const novoPersonagem = new Personagem(nomePersonagem);
                novoPersonagem.mostrarInventario();
                readline.close();
            } else {
                console.log("Opção inválida.");
                readline.close();
            }
        });
    } else {
        console.log("Nenhum arquivo de salvamento encontrado.");
        const nomePersonagem = "Novo Jogador"; // Pode ser personalizado
        const novoPersonagem = new Personagem(nomePersonagem);
        novoPersonagem.mostrarInventario();
        readline.close();
    }
}

function verificarSave() {
    if (fs.existsSync('save.json')) {
        console.log("Um arquivo de salvamento foi encontrado.");
        console.log("1. Carregar o jogo salvo");
        console.log("2. Excluir o jogo salvo e começar um novo");

        readline.question("Escolha uma opção: ", (opcao) => {
            if (opcao === '1') {
                personagem = Personagem.load();
                console.log(`Jogo carregado! Bem-vindo de volta, ${personagem.nome}!`);
                carregarJogo()
            } else if (opcao === '2') {
                fs.unlinkSync('save.json');
                console.log("Arquivo de salvamento excluído.");
                solicitarNome();
            } else {
                console.log("Opção inválida. Tente novamente.");
                verificarSave();
            }
        });
    } else {
        solicitarNome();
    }
}


let personagem;

// Funções de salvamento e carregamento

function salvarJogo() {
    const dadosPersonagem = {
        nome: personagem.nome,
        nivel: personagem.nivel,
        hp: personagem.hp,
        at: personagem.at,
        df: personagem.df,
        salaAtual: personagem.salaAtual,
        experience: personagem.experience,
        experienceParaProximoLV: personagem.experienceParaProximoLV,
        inventario: personagem.inventario,
        itensEquipados: personagem.itensEquipados,
        times_seen_flowey: personagem.times_seen_flowey
    };

    fs.writeFileSync('save.json', JSON.stringify(dadosPersonagem, null, 2));
    console.log("Jogo salvo com sucesso!");
}

function carregarJogo() {
    if (fs.existsSync('save.json')) {
        const dados = JSON.parse(fs.readFileSync('save.json'));
        personagem = new Personagem(dados.nome);
        personagem.nivel = dados.nivel;
        personagem.hp = dados.hp;
        personagem.at = dados.at;
        personagem.df = dados.df;
        personagem.experience = dados.experience;
        personagem.inventario = dados.inventario;
        personagem.itensEquipados = dados.itensEquipados;
        personagem.salaAtual = dados.salaAtual
        personagem.times_seen_flowey = dados.times_seen_flowey

        console.log("Jogo carregado com sucesso!");
        personagem.salaAtual()
    } else {
        console.log("Nenhum jogo salvo encontrado.");
        solicitarNome();
    }
}

// Função de ponto de salvamento
function pontoDeSalvamento() {
    console.log("Você encontrou um ponto de salvamento! Deseja salvar o progresso?");
    console.log("1. Sim");
    console.log("2. Não");

    readline.question("Escolha uma opção: ", (escolha) => {
        if (escolha === '1') {
            salvarJogo();
            personagem.salaAtual()
        } else if (escolha === '2') {
            personagem.salaAtual()
        } else {
            console.log("Escolha inválida! Tente novamente.");
            pontoDeSalvamento();
        }
    });
}

function limparConsole() {
    console.clear();
}

function mostrarInventario() {
    personagem.mostrarInventario();
    console.log("1. Inspecionar item");
    console.log("2. Equipar item");
    console.log("3. Fechar inventário");

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            inspecionarItem();
        } else if (escolha === '2') {
            equiparItem();
        } else if (escolha === '3') {
            if (personagem.salaAtual) {
                personagem.salaAtual(); // Retorna à função da sala armazenada
            } else {
                console.log("Erro: sala não encontrada.");
            }
        } else {
            console.log("Escolha inválida! Tente novamente.");
            mostrarInventario();
        }
    });
}

function inspecionarItem() {
    readline.question("Digite o número do item que deseja inspecionar: ", (numero) => {
        const index = parseInt(numero) - 1;
        personagem.inspecionarItem(index);
        mostrarInventario();
    });
}

function equiparItem() {
    readline.question("Digite o número do item que deseja equipar: ", (numero) => {
        const index = parseInt(numero) - 1;
        personagem.equiparItem(index);
        mostrarInventario();
    });
}

const consumables = {


}

const anotherItems = {


}
let times_seen_flowey = 0


//Daqui para baixo, é o jogo em si

function apresentar() {
    limparConsole();
    console.log("Bem-vindo a Undertale reescrito em JS!");
    console.log("Neste jogo, você terá que explorar, tomar decisões e lutar.");
    console.log("Prepare-se para uma aventura emocionante no Subsolo!");
    console.log("Você começará com 20 pontos de vida e enfrentará diversos desafios.");
    console.log("Boa sorte!\n");
}

function confirmarNome(inputNome) {
    readline.question(`Você escolheu o nome "${inputNome}". Você tem certeza? (s/n): `, (confirmacao) => {
        if (confirmacao.toLowerCase() === 's') {
            personagem = new Personagem(inputNome);
            personagem.inventario.push(graveto, bandagem); // Adiciona os itens ao inventário
            apresentarJogo();
        } else {
            solicitarNome();
        }
    });
}

function solicitarNome() {
    readline.question("Digite o nome do seu personagem: ", confirmarNome);
}

function apresentarJogo() {
    limparConsole();
    apresentar();
    console.log(`Seu personagem: ${personagem.nome}`);
    console.log(`Nível: ${personagem.nivel}, HP: ${personagem.hp}, AT: ${personagem.at}, DF: ${personagem.df}`);
    continuarJogo();
}

function continuarJogo() {
    readline.question("Digite 1 para continuar: ", (escolha) => {
        if (escolha === '1') {
            iniciarHistoria();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            continuarJogo();
        }
    });
}

function iniciarHistoria() {
    limparConsole();
    console.log(`Há muito tempo atrás, duas raças reinavam sobre a terra: Humanos e monstros.`);
    console.log(`Essas duas raças viviam em paz, até que um dia entraram em guerra...`);
    console.log(`Os humanos saíram vitoriosos e aprisionaram os monstros abaixo da terra com um poderoso feitiço.`);
    console.log(`MT. Ebott: 202X`);
    continuarComHistoria();
}

function continuarComHistoria() {
    readline.question("Digite 1 para continuar: ", (escolha) => {
        if (escolha === '1') {
            continuarExploracao();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            continuarComHistoria();
        }
    });
}

function continuarExploracao() {
    limparConsole();
    console.log(`Você acorda em uma cama de flores douradas, há um corredor à sua frente.`);
    console.log("1. Analisar as flores");
    console.log("2. Andar pelo corredor");
    console.log("3. Ver inventário");

    personagem.salaAtual = continuarExploracao; // Atualiza a função da sala atual

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            analisarFlores();
        } else if (escolha === '2') {
            firstCorridor();
        } else if (escolha === '3') {
            mostrarInventario();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            continuarExploracao();
        }
    });
}

function analisarFlores() {
    limparConsole();
    console.log(`São flores douradas, delicadas, mas... Passam uma sensação estranha...`);

    console.log("1. Analisar as flores novamente");
    console.log("2. Andar pelo corredor");
    console.log("3. Ver inventário");

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            analisarFlores();
        } else if (escolha === '2') {
            firstCorridor();
            times_seen_flowey + 1
        } else if (escolha === '3') {
            mostrarInventario();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            analisarFlores();
        }
    });
}

function firstCorridor() {
    limparConsole();
    console.log(`Você anda pelo corredor e encontra uma flor... "E ai parceiro! Meu nome é Flowey, Flowey a flor!"`);

    console.log("1. Continuar");
    console.log("2. Voltar para a sala anterior");
    console.log("3. Ver inventário");

    personagem.salaAtual = firstCorridor; // Atualiza a função da sala atual

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            flowey_first();
        } else if (escolha === '2') {
            continuarExploracao();
        } else if (escolha === '3') {
            mostrarInventario();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            firstCorridor();
        }
    });
}

function flowey_first() {
    limparConsole();
    console.log(`Flowey: 'Você deve ser novo por aqui. Vou ensinar como as coisas funcionam por aqui.'`);

    console.log("1. Continuar");

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            battle_flowey();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            flowey_first();
        }
    });
}

function battle_flowey() {
    limparConsole();
    console.log(`"Aqui no Subsolo nós temos uma coisa chamada LV... O que é LV? Love é claro! Você quer um pouco de love certo? Ele é compartilhado por pequenas e brancas... balinhas da amizade."`);
    console.log(`*Flowey libera algumas pastilhas brancas que vêm em sua direção* "Corra, pegue-as!"`);

    console.log(`1. Correr para as "Balinhas".`);
    console.log("2. Desviar delas.");

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            tomou();
        } else if (escolha === '2') {
            desviou();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            battle_flowey();
        }
    });
}

function tomou() {
    limparConsole();
    const dano = 19; // Dano recebido
    console.log(`*Flowey ri de você* "Idiota." "Como eu poderia deixar essa oportunidade passar?" "Neste mundo, é matar ou morrer."`);
    console.log(`*Balinhas se formam ao seu redor* "Morra."`);
    personagem.receberDano(dano); // Aplica o dano ao personagem

    console.log(`1. Continuar...`);

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            toriel_first_interaction();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            tomou();
        }
    });
}

function desviou() {
    limparConsole();
    const dano = 19; // Dano recebido
    personagem.receberDano(dano); // Aplica o dano ao personagem
    console.log(`*Você desvia das balas, mas Flowey ainda te atinge.*`);
    console.log(`*Flowey ri de você* "Idiota." "Você sabe exatamente o que está acontecendo aqui, não é?" "Neste mundo, é matar ou morrer."`);
    console.log(`*Balinhas se formam ao seu redor* "Morra."`);

    console.log(`1. Continuar...`);

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            toriel_first_interaction();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            desviou();
        }
    });
}

function toriel_first_interaction() {
    limparConsole();
    console.log(`*De repente, um figura em forma de cabra aparece`);
    console.log(`*Ela solta uma magia sobre flowey, que voa para longe*`);
    console.log(`"Que criatura mais Perversa, machucando uma criança tão inocente..."`);

    console.log(`1. Continuar...`);

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            toriel_second_interaction();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            toriel_first_interaction();
        }
    });
}

function toriel_second_interaction() {
    personagem.salaAtual = toriel_second_interaction
    limparConsole();
    console.log(`"Não tenha medo minha criança, meu nome é Toriel, guardiã das ruinas"`);
    console.log(`"Venha, vou te guiar pelas catacumbas"`);

    console.log(`1. Seguir toriel`);
    console.log(`2. Abrir inventario`);

    readline.question("Digite o número da sua escolha: ", (escolha) => {
        if (escolha === '1') {
            toriel_first_puzzle();
        }else if (escolha === '2') {
            mostrarInventario();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            toriel_second_interaction();
        }
    });
}

function toriel_first_puzzle() {
    personagem.salaAtual = toriel_first_puzzle
    limparConsole
    console.log(`As ruinas são cheias de puzzles, para se movimentar por aqui, terá que resolve-los.`);
    console.log(`Nesta placa aqui diz: "Caminhando ao fim da tarde, uma senhora contou 20 casas em uma rua à sua direita. 
No regresso, ela contou 20 casas à sua esquerda. Quantas casas ela viu no total?"`);

    readline.question("Digite a resposta para o puzzle: ", (escolha) => {
        if (escolha === '20') {
            puzzle_correct();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            toriel_first_puzzle();
        }
    });
}

function puzzle_correct() {
    personagem.salaAtual = puzzle_correct
    limparConsole();
    console.log(`Parabéns, você conseguiu`);
    console.log(`Toriel: "Venha, siga-me ara a proxima sala`);

    console.log(`1. Seguir toriel`);
    console.log(`2. Abrir inventario`);

    readline.question("Continue para a proxima sala: ", (escolha) => {
        if (escolha === '1') {
            first_savepoint();
        }else if (escolha === '2') {
            mostrarInventario();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            toriel_second_interaction();
        }
    });
}

function first_savepoint() {
    personagem.salaAtual = first_savepoint
    limparConsole();
    console.log(`Toriel: "Vamos minha criança, as catacumbas são perigosas e cheias de puzzles`);
    console.log(`Tem algumas alavancas para você apertar"`);
    console.log(`**Você encontrou um ponto de save, deseja salvar?`);

    console.log(`1. Seguir toriel`);
    console.log(`2. Abrir inventario`);
    console.log(`3. Interagir com o savepoint`);

    readline.question("Digite a resposta para o puzzle: ", (escolha) => {
        if (escolha === '1') {
            analisarFlores();
        } else if (escolha === '2') {
            mostrarInventario();
        } else if (escolha === '3') {
            pontoDeSalvamento();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            first_savepoint();
        }
    });
}
function levers_room() {
    personagem.salaAtual = levers_room
    limparConsole();
    console.log(`Toriel: "Aqui temos algumas alavancas, eu marquei as que você deve pressionar"`);
    console.log(`**Há algumas alavancas a frente`);
    console.log(`**Você encontrou um ponto de save, deseja salvar?`);

    console.log(`1. Seguir toriel`);
    console.log(`2. Abrir inventario`);
    console.log(`3. Interagir com o savepoint`);

    readline.question("Digite a resposta para o puzzle: ", (escolha) => {
        if (escolha === '1') {
            analisarFlores();
        } else if (escolha === '2') {
            mostrarInventario();
        } else if (escolha === '3') {
            pontoDeSalvamento();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            first_savepoint();
        }
    });
}
function first_savepoint() {
    personagem.salaAtual = first_savepoint
    limparConsole();
    console.log(`Toriel: "Vamos minha criança, as catacumbas são perigosas e cheias de puzzles`);
    console.log(`Tem algumas alavancas para você apertar"`);
    console.log(`**Você encontrou um ponto de save, deseja salvar?`);

    console.log(`1. Seguir toriel`);
    console.log(`2. Abrir inventario`);
    console.log(`3. Interagir com o savepoint`);

    readline.question("Digite a resposta para o puzzle: ", (escolha) => {
        if (escolha === '1') {
            analisarFlores();
        } else if (escolha === '2') {
            mostrarInventario();
        } else if (escolha === '3') {
            pontoDeSalvamento();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            first_savepoint();
        }
    });
}
function first_savepoint() {
    personagem.salaAtual = first_savepoint
    limparConsole();
    console.log(`Toriel: "Vamos minha criança, as catacumbas são perigosas e cheias de puzzles`);
    console.log(`Tem algumas alavancas para você apertar"`);
    console.log(`**Você encontrou um ponto de save, deseja salvar?`);

    console.log(`1. Seguir toriel`);
    console.log(`2. Abrir inventario`);
    console.log(`3. Interagir com o savepoint`);

    readline.question("Digite a resposta para o puzzle: ", (escolha) => {
        if (escolha === '1') {
            analisarFlores();
        } else if (escolha === '2') {
            mostrarInventario();
        } else if (escolha === '3') {
            pontoDeSalvamento();
        } else {
            console.log("Escolha inválida! Tente novamente.");
            first_savepoint();
        }
    });
}

// Inicia o jogo pedindo o nome do personagem
verificarSave();