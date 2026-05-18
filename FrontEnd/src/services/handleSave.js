const handleSave = async () => {
  try {

    const newProcurement = {
      ...formData,

      anexos: attachments.map((file) => ({
        nome: file.name,
        tamanho: `${Math.round(file.size / 1024)} KB`,
        tipo: file.name.split(".").pop(),
      })),

      criadoEm: new Date().toLocaleString("pt-BR"),
    }

    const response = await fetch(
      "http://localhost:3000/procurements",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newProcurement),
      }
    )

    if (!response.ok) {
      throw new Error("Erro ao criar licitação")
    }

    const createdProcurement = await response.json()

    console.log("Licitação criada:", createdProcurement)

    alert("Licitação criada com sucesso!")

    navigate("/ProcurementList")

  } catch (error) {

    console.error(error)

    alert("Erro ao salvar licitação.")
  }
}