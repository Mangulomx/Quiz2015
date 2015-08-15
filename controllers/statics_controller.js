var models = require('../models/models.js');

//Calcular las estadísticas

exports.results = function(req, res, next)
{
	var stats = {
		totalPreguntas : 0,
		totalComentarios : 0,
		preguntasComentadas : 0,
		promedioComentarios : 0,
		preguntasNoComentadas : 0
	};

	//total de preguntas
	models.Quiz.count().then(function(count)
	{
		stats.totalPreguntas = count;

		//Total comentarios
		models.Comment.count().then(function(count)
		{
			stats.totalComentarios = count;
			stats.promedioComentarios = stats.totalComentarios / stats.totalPreguntas;

			//Preguntas con comentarios

			var strQuery = 'SELECT COUNT(DISTINCT "quizId") as num from "Comments"';
			models.Sequelize.query(strQuery)
			.then(function(results)
			{
				stats.preguntasComentadas = results[0].num;
				stats.preguntasNoComentadas = stats.totalPreguntas - stats.preguntasComentadas;

				console.log('Total preguntas: ' + stats.totalPreguntas);
				console.log('Total Comentarios: ' + stats.totalComentarios);
				console.log('Nº medio de comentarios por pregunta:' + stats.promedioComentarios);
				console.log('Preguntas Comentadas:' + stats.preguntasComentadas);
				console.log('Preguntas No Comentadas:' + stats.preguntasNoComentadas);

				res.render('stats/show.ejs', {stats:stats, errors:[]});
			});

		});
	});
}