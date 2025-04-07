self.onmessage = async (event) => {
    const { file, postmap, gameid, fileName } = event.data;

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result.split(',')[1]; // Obter apenas os dados base64
            try {
                const response = await fetch(postmap, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: fileName + ".sav",
                        data: base64data,
                        id: gameid
                    })
                });

                const result = await response.json();
                if (result.success) {
                    self.postMessage({ success: true });
                } else {
                    self.postMessage({ success: false, message: "Falha ao salvar no servidor." });
                }
            } catch (error) {
                self.postMessage({ success: false, message: error.message });
            }
        };
        reader.readAsDataURL(new Blob([file]));
    } catch (error) {
        self.postMessage({ success: false, message: error.message });
    }
};
