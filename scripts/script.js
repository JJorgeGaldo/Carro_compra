const btn = document.querySelector(".btn-dark")
        const bgSuccess = document.querySelector(".bg-success")

        btn.addEventListener("click", (e)=>{
            console.log("boton")
            e.stopImmediatePropagation()
        })
        bgSuccess.addEventListener("click", ()=>{console.log("clic bgs")})


        const container = document.querySelector(".container")
        const span = document.getElementById("span")
        let cont = 0
                
        container.addEventListener("click", e => {
/*             console.log(e.target.classList.contains("btn-info"))
 */            if (e.target.classList.contains("btn-info")){
                cont ++
                span.textContent = cont
            }
            if (e.target.classList.contains("btn-danger")){
                cont --
                span.textContent = cont
            }
            e.stopPropagation()
        })

        document.body.addEventListener ("click", ()=>{
            console.log("clickaste en el body")
        })