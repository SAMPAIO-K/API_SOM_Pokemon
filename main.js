const formulario = document.getElementById("formPoke");
const msg = document.getElementById("msg");
const resultado = document.getElementById("resultado");
const containerSom = document.getElementById("containerSom");
const somPoke = document.getElementById("somPoke");

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault(); // evitar que a página recarregue

    const id = document.getElementById("idPoke").value;
    
    // Feedback visual de carregamento
    msg.textContent = "Buscando Pokémon...";
    msg.style.color = "#007bff";
    resultado.classList.add("hidden");
    containerSom.classList.add("hidden"); // Esconde o player de som durante a busca

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado. Verifique o ID e tente novamente.");
        }

        const pokemon = await resposta.json();

        // 1. Nome, Imagem e Experiência Base (mantidos como solicitado)
        document.getElementById("nomePokemon").textContent = pokemon.name;
        document.getElementById("imgPoke").src = pokemon.sprites.front_default;
        document.getElementById("basePoke").textContent = `Experiência Base: ${pokemon.base_experience}`;

        // 2. Tipos (Array formatado)
        const tipos = pokemon.types
            .map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
            .join(" / ");
        document.getElementById("tipoPoke").textContent = `Tipo: ${tipos}`;

        // 3. Peso (Convertido de hectogramas para kg)
        const pesoEmKg = (pokemon.weight / 10).toFixed(1);
        document.getElementById("pesoPoke").textContent = `Peso: ${pesoEmKg} kg`;

        // 4. NOVO: Som (Cry)
        // A API fornece 'latest' (ogg, melhor qualidade) e 'legacy' (wav)
        if (pokemon.cries && pokemon.cries.latest) {
            somPoke.src = pokemon.cries.latest;
            containerSom.classList.remove("hidden"); // Mostra o player se o som existir
        } else {
            containerSom.classList.add("hidden"); // Esconde se não houver áudio disponível
        }

        // Sucesso: limpa a mensagem de carregamento e exibe o resultado
        msg.textContent = "";
        resultado.classList.remove("hidden");

    } catch (erro) {
        // Tratamento de erro
        msg.textContent = erro.message;
        msg.style.color = "#dc3545";
        resultado.classList.add("hidden");
    }
});