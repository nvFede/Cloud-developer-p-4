import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // Implement creating a new TODO item
    logger.info('Creating a new todo item...');

    const userId = getUserId(event);

    const newItem = await createTodo(newTodo, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        "item": newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)