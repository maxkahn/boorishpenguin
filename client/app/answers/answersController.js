angular.module('boorish.answers', [])
.controller('answersController', function($scope, $state, $window, $stateParams, $mdToast, $document, Answers, Questions, Users, Auth) {
  var questionId = $stateParams.id;

  $scope.question = {};
  $scope.answers = {};
  $scope.newAnswer = {};
  $scope.newComment = {};

  var getQuestion = function(questionId){
    Questions.getQuestion(questionId).then(function(res) {
      $scope.question = res[0];
      $scope.answers = res.slice(1);
      for (var i=0; i<$scope.answers.length; i++){
        $scope.answers[i].newComment = {};
        $scope.answers[i].newComment.text = "";
      }
    });
  };

  $scope.submitAnswer = function(){
    var answerToInsert = {
      QuestionId: questionId,
      isQuestionType: false,
      isAnswerType: true,
      title: '',
      text: $scope.newAnswer.text,
      userId: 2 //TODO: get this from Auth
    };

    Answers.addAnswer(answerToInsert)
      .then(function(newAnswer){
        showAnswerSubmittedToast();
        $scope.answers.push({
          id: newAnswer.data.id,
          text: newAnswer.data.text,
          isCorrectAnswer: false,
          votes: 0,
          createdAt: 'just now',
          user: "cpenarrieta", //TODO get this from the Auth
          imgUrl: "http://images.apple.com/pr/bios/images/williams_thumb20110204.jpg", //TODO get this from the Auth
        });
      });

    $scope.newAnswer.text = '';
  };

  var showAnswerSubmittedToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Answer Submitted')
        .position('top left')
        .parent($document[0].querySelector('#answer_container_id'))
        .hideDelay(2000)
    );
  };

  $scope.markGoodQuestion = function(){
    Questions.markGoodQuestion(questionId)
      .then(function(){
        $scope.question.isPreferred = $scope.question.isPreferred ? false : true;
      });
  };

  $scope.markCorrectAnswer = function(answer){
    Answers.markCorrectAnswer(answer.id)
      .then(function(){
        answer.isPreferred = answer.isPreferred ? false : true;
      });
  };

  $scope.showComments = function(answer){
    if (answer.comments && answer.comments.length > 0){
      answer.comments = [];
    } else {
      answer.comments = [];
      Answers.getCommentsOfAnAnswer(answer.id)
        .then(function(comments){
          answer.comments = comments;
        });
    }
  };

  $scope.submitComment = function(answer){
    if (answer.newComment.text.trim() === ''){
      return;
    }

    if (!answer.comments){
      answer.comments = [];
    }

    var commentToInsert = {
      text: answer.newComment.text,
      userId: 2, //TODO: get this from Auth
      responseId: answer.id
    };

    Answers.addCommentToAnswer(commentToInsert)
      .then(function(){
        Answers.getCommentsOfAnAnswer(answer.id)
          .then(function(comments){
            answer.comments = comments;
            answer.newComment.text = '';
            answer.responses++;
          });
      });
  };

  if (questionId){
    getQuestion(questionId);
  }

});
