const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');
const { ObjectId } = require('mongodb');

// Define the Comment type
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    _id: { type: GraphQLString },
    taskId: { type: GraphQLString },
    userId: { type: GraphQLString },
    text: { type: GraphQLString },
    likes: { type: GraphQLString },
    replies: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    edited: { type: GraphQLString },
    created_at: { type: GraphQLString }
  })
});

// Define the Project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    manager: { type: GraphQLString },
    status: { type: GraphQLString },
    startDate: { type: GraphQLString },
    dueDate: { type: GraphQLString },
    teamMembers: { type: new GraphQLList(GraphQLString) },
    tasks: { type: new GraphQLList(GraphQLString) },
    progress: { type: GraphQLString },
    created_at: { type: GraphQLString }
  })
});

// Define the Task type
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    assignee: { type: GraphQLString },
    status: { type: GraphQLString },
    priority: { type: GraphQLString },
    dueDate: { type: GraphQLString },
    created_at: { type: GraphQLString },
    attachments: { type: GraphQLList(GraphQLString) },
    tags: { type: GraphQLList(GraphQLString) }
  })
});

// Define the User type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    address: { type: GraphQLString }
  })
});
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    comment: {
      type: CommentType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args, { commentsCollection }) {
        // Convert the _id argument to ObjectId
        const commentId = new ObjectId(args._id);

        // Logic to retrieve a comment by ID
        return commentsCollection.findOne({ _id: commentId });
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, { commentsCollection }) {
        return commentsCollection.find({}).toArray();
      }
    },
    project: {
      type: ProjectType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args, { projectsCollection }) {
        const projectId = new ObjectId(args._id);
        return projectsCollection.findOne({ _id: projectId });
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args, { projectsCollection }) {
        // Logic to retrieve all projects
        return projectsCollection.find({}).toArray();
      }
    },
    task: {
      type: TaskType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args, { tasksCollection }) {
        const taskId = new ObjectId(args._id);
        return tasksCollection.findOne({ _id: taskId });
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args, { tasksCollection }) {
        // Logic to retrieve all tasks
        return tasksCollection.find({}).toArray();
      }
    },
    user: {
      type: UserType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args, { usersCollection }) {
        const userId = new ObjectId(args._id);
        // Logic to retrieve a user by ID
        return usersCollection.findOne({ _id: userId });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, { usersCollection }) {
        return usersCollection.find({}).toArray();
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    // Comment Mutations
    createComment: {
      type: CommentType,
      args: {
        taskId: { type: GraphQLString },
        userId: { type: GraphQLString },
        text: { type: GraphQLString },
        likes: { type: GraphQLString },
        replies: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        edited: { type: GraphQLString },
        created_at: { type: GraphQLString }
      },
      resolve: async (parent, args, { commentsCollection }) => {
        try {
          const { taskId, userId, text, likes, replies, tags } = args;

          const newComment = {
            taskId,
            userId,
            text,
            likes,
            replies,
            tags,
            edited: null,
            created_at: new Date().toISOString()
          };

          const result = await commentsCollection.insertOne(newComment);
          const insertedComment = await commentsCollection.findOne({ _id: result.insertedId });

          return insertedComment;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to create a new comment.');
        }
      }
    },
    updateComment: {
      type: CommentType,
      args: {
        _id: { type: GraphQLString },
        text: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async (parent, args, { commentsCollection }) => {
        try {
          const commentId = new ObjectId(args._id);
          const { text, tags } = args;

          const updatedComment = await commentsCollection.findOneAndUpdate(
            { _id: commentId },
            { $set: { text, tags, edited: new Date().toISOString() } },
            { returnOriginal: false }
          );

          return updatedComment.value;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to update the comment.');
        }
      }
    },
    deleteComment: {
      type: CommentType,
      args: {
        _id: { type: GraphQLString }
      },
      resolve: async (parent, args, { commentsCollection }) => {
        try {
          const commentId = new ObjectId(args._id);
          const deletedComment = await commentsCollection.deleteOne({ _id: commentId });

          if (deletedComment.deletedCount > 0) {
            return { _id: args._id };
          } else {
            throw new Error('Some error occurred while deleting the comment.');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Failed to delete the comment.');
        }
      }
    },

    // Project Mutations
    createProject: {
      type: ProjectType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        manager: { type: GraphQLString },
        status: { type: GraphQLString },
        startDate: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        teamMembers: { type: new GraphQLList(GraphQLString) },
        tasks: { type: new GraphQLList(GraphQLString) },
        progress: { type: GraphQLString }
      },
      resolve: async (parent, args, { projectsCollection }) => {
        try {
          const {
            title,
            description,
            manager,
            status,
            startDate,
            dueDate,
            teamMembers,
            tasks,
            progress
          } = args;

          const project = {
            title,
            description,
            manager,
            status,
            startDate: new Date(startDate),
            dueDate: new Date(dueDate),
            teamMembers,
            tasks,
            progress,
            created_at: new Date().toISOString()
          };

          const result = await projectsCollection.insertOne(project);
          const insertedProject = await projectsCollection.findOne({ _id: result.insertedId });

          return insertedProject;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to create a new project.');
        }
      }
    },

    updateProject: {
      type: ProjectType,
      args: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        manager: { type: GraphQLString },
        status: { type: GraphQLString },
        startDate: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        teamMembers: { type: new GraphQLList(GraphQLString) },
        tasks: { type: new GraphQLList(GraphQLString) },
        progress: { type: GraphQLString }
      },
      resolve: async (parent, args, { projectsCollection }) => {
        try {
          const projectId = new ObjectId(args._id);
          const {
            title,
            description,
            manager,
            status,
            startDate,
            dueDate,
            teamMembers,
            tasks,
            progress
          } = args;

          const updatedProject = await projectsCollection.findOneAndUpdate(
            { _id: projectId },
            {
              $set: {
                title,
                description,
                manager,
                status,
                startDate: new Date(startDate),
                dueDate: new Date(dueDate),
                teamMembers,
                tasks,
                progress,
                updated_at: new Date().toISOString()
              }
            },
            { returnOriginal: false }
          );

          return updatedProject.value;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to update the project.');
        }
      }
    },
    deleteProject: {
      type: ProjectType,
      args: {
        _id: { type: GraphQLString }
      },
      resolve: async (parent, args, { projectsCollection }) => {
        try {
          const projectId = new ObjectId(args._id);
          const deletedProject = await projectsCollection.deleteOne({ _id: projectId });

          if (deletedProject.deletedCount > 0) {
            return { _id: args._id };
          } else {
            throw new Error('Some error occurred while deleting the project.');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Failed to delete the project.');
        }
      }
    },

    // Task Mutations
    createTask: {
      type: TaskType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        assignee: { type: GraphQLString },
        status: { type: GraphQLString },
        priority: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        attachments: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async (parent, args, { tasksCollection }) => {
        try {
          const { title, description, assignee, status, priority, dueDate, attachments, tags } =
            args;

          const task = {
            title,
            description,
            assignee,
            status,
            priority,
            dueDate: new Date(dueDate),
            attachments,
            tags,
            created_at: new Date().toISOString()
          };

          const result = await tasksCollection.insertOne(task);
          const insertedTask = await tasksCollection.findOne({ _id: result.insertedId });
          return insertedTask;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to create a new task.');
        }
      }
    },
    updateTask: {
      type: TaskType,
      args: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        assignee: { type: GraphQLString },
        status: { type: GraphQLString },
        priority: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        attachments: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async (parent, args, { tasksCollection }) => {
        try {
          const taskId = new ObjectId(args._id);
          const { title, description, assignee, status, priority, dueDate, attachments, tags } =
            args;

          const updatedTask = await tasksCollection.findOneAndUpdate(
            { _id: taskId },
            {
              $set: {
                title,
                description,
                assignee,
                status,
                priority,
                dueDate: new Date(dueDate),
                attachments,
                tags,
                updated_at: new Date().toISOString()
              }
            },
            { returnOriginal: false }
          );

          return updatedTask.value;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to update the task.');
        }
      }
    },
    deleteTask: {
      type: TaskType,
      args: {
        _id: { type: GraphQLString }
      },
      resolve: async (parent, args, { tasksCollection }) => {
        try {
          const taskId = new ObjectId(args._id);
          const deletedTask = await tasksCollection.deleteOne({ _id: taskId });

          if (deletedTask.deletedCount > 0) {
            return { _id: args._id };
          } else {
            throw new Error('Some error occurred while deleting the task.');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Failed to delete the task.');
        }
      }
    },

    // User Mutations
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        address: { type: GraphQLString }
      },
      resolve: async (parent, args, { usersCollection }) => {
        try {
          const { name, email, username, password, role, phoneNumber, address } = args;

          const user = {
            name,
            email,
            username,
            password,
            role,
            phoneNumber,
            address
          };

          const result = await usersCollection.insertOne(user);
          const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
          return insertedUser;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to create a new user.');
        }
      }
    },
    updateUser: {
      type: UserType,
      args: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        address: { type: GraphQLString }
      },
      resolve: async (parent, args, { usersCollection }) => {
        try {
          const userId = new ObjectId(args._id);
          const { name, email, username, password, role, phoneNumber, address } = args;

          const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                name,
                email,
                username,
                password,
                role,
                phoneNumber,
                address,
                updated_at: new Date().toISOString()
              }
            },
            { returnOriginal: false }
          );

          return updatedUser.value;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to update the user.');
        }
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        _id: { type: GraphQLString }
      },
      resolve: async (parent, args, { usersCollection }) => {
        try {
          const userId = new ObjectId(args._id);
          const deletedUser = await usersCollection.deleteOne({ _id: userId });

          if (deletedUser.deletedCount > 0) {
            return { _id: args._id };
          } else {
            throw new Error('Some error occurred while deleting the user.');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Failed to delete the user.');
        }
      }
    }
  }
});

// Create and export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
