async function isUrlFound(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            cache: 'no-cache'
        });

        return response.status === 200;

    } catch(error) {
        // console.log(error);
        return false;
    }
}

function moeda(input){ //coloca duas casas decimais
    console.log(input.value)
    input.value = Number(input.value).toFixed(2)
}

function pega_colunas_grade(response) {
    return new Promise((resolve, reject) => {
        var tamanhos = [];
                    
        if(response.grades[0].tam01){
            tamanhos.push(response.grades[0].tam01);
        }
        if(response.grades[0].tam02){
            tamanhos.push(response.grades[0].tam02);
        }
        if(response.grades[0].tam03){
            tamanhos.push(response.grades[0].tam03);
        }
        if(response.grades[0].tam04){
            tamanhos.push(response.grades[0].tam04);
        }
        if(response.grades[0].tam05){
            tamanhos.push(response.grades[0].tam05);
        }
        if(response.grades[0].tam06){
            tamanhos.push(response.grades[0].tam06);
        }
        if(response.grades[0].tam07){
            tamanhos.push(response.grades[0].tam07);
        }
        if(response.grades[0].tam08){
            tamanhos.push(response.grades[0].tam08);
        }
        if(response.grades[0].tam09){
            tamanhos.push(response.grades[0].tam09);
        }
        if(response.grades[0].tam10){
            tamanhos.push(response.grades[0].tam10);
        }
        if(response.grades[0].tam11){
            tamanhos.push(response.grades[0].tam11);
        }
        if(response.grades[0].tam12){
            tamanhos.push(response.grades[0].tam12);
        }
        if(response.grades[0].tam13){
            tamanhos.push(response.grades[0].tam13);
        }
        if(response.grades[0].tam14){
            tamanhos.push(response.grades[0].tam14);
        }
        if(response.grades[0].tam15){
            tamanhos.push(response.grades[0].tam15);
        }

        resolve(tamanhos);
    });
}

function pega_colunas_grade_individual(response) {
    return new Promise((resolve, reject) => {
        var tamanhos = [];
                    
        if(response.tam01){
            tamanhos.push(response.tam01);
        }
        if(response.tam02){
            tamanhos.push(response.tam02);
        }
        if(response.tam03){
            tamanhos.push(response.tam03);
        }
        if(response.tam04){
            tamanhos.push(response.tam04);
        }
        if(response.tam05){
            tamanhos.push(response.tam05);
        }
        if(response.tam06){
            tamanhos.push(response.tam06);
        }
        if(response.tam07){
            tamanhos.push(response.tam07);
        }
        if(response.tam08){
            tamanhos.push(response.tam08);
        }
        if(response.tam09){
            tamanhos.push(response.tam09);
        }
        if(response.tam10){
            tamanhos.push(response.tam10);
        }
        if(response.tam11){
            tamanhos.push(response.tam11);
        }
        if(response.tam12){
            tamanhos.push(response.tam12);
        }
        if(response.tam13){
            tamanhos.push(response.tam13);
        }
        if(response.tam14){
            tamanhos.push(response.tam14);
        }
        if(response.tam15){
            tamanhos.push(response.tam15);
        }

        resolve(tamanhos);
    });
}

function array_tams(item){
    return new Promise((resolve, reject) => {
        var valores = [];
        valores.push(item.tam01);
        valores.push(item.tam02);
        valores.push(item.tam03);
        valores.push(item.tam04);
        valores.push(item.tam05);
        valores.push(item.tam06);
        valores.push(item.tam07);
        valores.push(item.tam08);
        valores.push(item.tam09);
        valores.push(item.tam10);
        valores.push(item.tam11);
        valores.push(item.tam12);
        valores.push(item.tam13);
        valores.push(item.tam14);
        valores.push(item.tam15);
        resolve(valores);
    });
}