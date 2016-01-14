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

  $scope.submitComment = function(answerId){
    console.log(answerId);
    console.log($scope.newComment.text);
    $scope.newComment.text = '';
    console.log('submit comment');
  };

  if (questionId){
    getQuestion(questionId);
  }

});
