API (all of this is before any refactor)
  (Question: we'll probably need new/add'tl POST routes for comments)

 TODO:  1. Convert any /townhall paths to /api paths.
  2. Try to match paths that currently don't match.
  3. anything that sends or requires {mod: mod} objects has to be refactored.

Requests from client (services.js):
  /api/questions  POST  (addQuestion) (exists on server)
    data: JSON.stringify(text, id_user, course, tag, title)

  /api/questions/ GET (getAllQuestions) (exists on server)
    expects .results field on returned data
  /api + path   GET   (getQuestion) (exists on server)
    expects.results field to be an array with one q, many a's
  api/questions/ + id POST  (updateQuestion) (exists on server)
    data: {mod: mod} TODO: refactor this; doesn't match our refactor at all.
  api/questions/ + questionID DELETE  (removeQuestion) (exists on server)

  api/answers   GET   (getAnswers)
  api/answers   POST  (addAnswer) (exists on server)
    data: JSON.stringify(text, id_question, id_user)
  api/answers/ + answerID POST (updateAnswer) (exists on server)
    data: JSON.stringify(id_answer, mod)
  api/answers/ + answerID DELETE (removeAnswer) (exists on server)

  /api/users  GET   (allUsers) (exists on server)
    returns a data structure of users
  /api/users/ + userID  GET (getUserWithId) (exists on server)
    expects a results.id field on the res.data object
  /api/users  POST  (addUser)
    data: JSON.stringify(username, password, name, isTeacher, points, email, picture)

  /api/tags GET   (getTags) (exists on server)
    expects a results field on returned data

  /api/courses  GET (getCourses) (exists on server)

  /user GET (setUser) (exists on server)

    expects .data.email field or .data.profile.emails array

  /api/users  GET (anonymous)
  /api/users  GET (signin, in auth.js)

Routes on server:
  /api/questions    GET   (exists on client)

    returns data with results field an array of objects. Each object {id:, title:, text:, isCorrectAnswer:, points:, responses:, isAnswered:, isGood:, isClosed:, createdAt:, coursename:, tagname:, user:, imgUrl:, updatedAt:}

  /api/questions    POST  (exists on client)
  /api/questions/:id  DELETE (exists on client)
  /api/questions/:id  GET (exists on client)
  /api/questions/:id  POST (exists on client)

  /api/answers  POST  (exists on client)
  /api/answers/:id  POST (exists on client)
  /api/answers/:id  DELETE (exists on client)

  /api/users  GET (exists on client)
  /api/users/:id  GET (exists on client)

  /api/signup POST

  /api/courses  GET (exists on client)

  /api/tags GET   (exists on client)

  /auth/google  GET

  /auth/google/callback GET

  /user  GET (exists on server)

