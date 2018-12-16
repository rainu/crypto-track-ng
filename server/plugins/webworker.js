import CourseWorker from 'workerize-loader!../webworker/course'

export default function ({app, store}) {
  const courseWorker = new CourseWorker

  app.$webworker = {
    course: courseWorker
  }

  store.$webworker = app.$webworker
}
