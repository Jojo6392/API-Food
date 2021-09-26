function createNode(element) {
    return document.createElement(element)
}

function append(parent, el){
    return parent.appendChild(el)
}

//Récupération des catégories de meal
const listCategories = document.getElementById('listCategories')
const urlCategories = "https://www.themealdb.com/api/json/v1/1/categories.php"
var tableauCategories = []

fetch(urlCategories)
.then((resp) => resp.json())
.then(data => {
    let categories = data.categories
    return categories.map(function(categorie) {
        tableauCategories.push(categorie.strCategory)
    })
})
.catch(function(error) {
    console.log(error)
})

const urlRandomMeal = "https://www.themealdb.com/api/json/v1/1/random.php"
var tableauRandomMeals = []
var stop = false

if(tableauRandomMeals.length == 0) {
    divChargement = createNode('div')
    divChargement.innerHTML = 'Chargement en cours...'
    append(listCategories, divChargement)
} 
else {

}

var temp = []
//Fonction qui permet de récupérer 50 random meals
function randomMeal(){
    $.ajax({
        url: urlRandomMeal,
        dataType: 'json',
        async: true,
        success: function(data){
            const mealAllData = data.meals[0]
            const meal = mealAllData.strMeal

            if(!temp.includes(data.meals[0].idMeal)){
                temp.push(data.meals[0].idMeal)
                tableauRandomMeals.push(mealAllData)
            }
            if(tableauRandomMeals.length < 50  ) {
                randomMeal()
            }
            else {
                stop = true
            }
        }
    });
    return tableauRandomMeals
}
randomMeal()

const divMsgChargement = document.getElementById('divMsgChargement')
var loop = setInterval(() =>{
    if(stop) {
        console.log('continue')
        clearInterval(loop)
        //console.log(tableauRandomMeals)
        divChargement.setAttribute('id', 'chargementHidden')
        append(divMsgChargement, divChargement)

        for(var i = 0; i < tableauCategories.length; i++) {
            var pCategorie = createNode('p')
            pCategorie.innerHTML = tableauCategories[i]
            pCategorie.setAttribute('id', 'pCategorie')
            append(listCategories, pCategorie)
            var hr = createNode('hr')
            append(pCategorie, hr)
            
            tableauRandomMeals.map((meal) => {
                if(meal.strCategory == tableauCategories[i]) {

                    var divMeal = createNode('div')
                    var buttonMeal = createNode('button')
                    buttonMeal.innerHTML = meal.strMeal
                    buttonMeal.setAttribute('id', `meal-${meal.idMeal}`)
                    buttonMeal.setAttribute('class', 'button')
                    append(divMeal, buttonMeal)
                    append(pCategorie, divMeal)
                    var br = createNode('br')
                    append(pCategorie, br)

                    //div infos sur la meal
                    var divContenuMeal = createNode('p')
                    divContenuMeal.setAttribute('class', 'hidden') //Cacher les informations des meals par défaut
                    divContenuMeal.setAttribute('id', `id-${meal.idMeal}`)
                    buttonMeal.setAttribute('data-id', `${meal.idMeal}`)
                    append(divMeal, divContenuMeal)

                    divContenuMealPrinc = createNode('div')
                    divContenuMealPrinc.setAttribute('class', 'contenuMealPrinc')
                    append(divContenuMeal, divContenuMealPrinc)
                    divContenuMealSecond = createNode('div')
                    divContenuMealPrinc.setAttribute('class', 'contenuMealSecond')
                    append(divContenuMeal, divContenuMealSecond)
                    
                    var pays = meal.strArea
                    var instructions = meal.strInstructions
                    var thumb = meal.strMealThumb
                    var nomMeal = meal.strMeal
                    
                    var imgMeal = createNode('img')
                    imgMeal.src = thumb
                    append(divContenuMealPrinc, imgMeal)

                    var divNom_et_PaysMeal = createNode('div')
                    divNom_et_PaysMeal.innerHTML = 'Nom du repas : <b>' + nomMeal + '</b><br /> Pays d\'origine : <b>' + pays + '</b><br /><br />Ingrédients :'
                    divNom_et_PaysMeal.setAttribute('style', 'margin-left: 10px; text-align: start;') //faire ça pour la div qui contiendra pays et ingrédients
                    append(divContenuMealPrinc, divNom_et_PaysMeal)

                    var divInstruMeal = createNode('div')
                    divInstruMeal.innerHTML = '<b>Instructions</b> : '+instructions
                    divInstruMeal.setAttribute('class', 'instruMeal')
                    append(divContenuMealSecond, divInstruMeal)

                    for(let i = 1; meal[`strIngredient${i}`]; i++){
                        const ingredients = `🥢 ${meal[`strIngredient${i}`]}`
                        const mealIngredient = createNode('div')
                        mealIngredient.innerText = ingredients;
                        mealIngredient.className = 'mealIngredient'
                        divNom_et_PaysMeal.appendChild(mealIngredient);
                    }
                }
                })
        }
    }

    //fonction jquery d'apparition/disparition des infos d'un repas
    $(function () {
        $('.button').click(function () {

            var id = $(this).attr("data-id")
            var divMealClick = document.getElementById('id-'+id)

            $('.button#meal-'+id).css("color", "#714A0A")

            if($(divMealClick).is(':hidden')){
                $(divMealClick).css("display", "block")
                divMealClick.className += " active";
            }
            else if($(divMealClick).is(':visible')){
                $(divMealClick).css("display", "none")
                $('.button#meal-'+id).css("color", "black")
            }
        });
    });
}, 1000)

