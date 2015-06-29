var path = require('path');
//Cargar Modelo ORM
var Sequelize = require('sequelize');
//Usar 8800 SQLite

var sequelize = new Sequelize(null, null, null, {dialect:"sqlite", storage:"quiz.sqlite"});
//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exporta la definición de la tabla Quiz
//sequelize.syncr() crea e inicializa la tabla de preguntas en la DB
sequelize.sync().then(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count)
	{
		if(count === 0) //La tabla se inicializa si esta vacia
		{
			Quiz.create(
			{
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			})
			.then(function()
			{
				console.log('Base de datos inicializada');
			});
		}
	});
});