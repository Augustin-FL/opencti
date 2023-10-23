import type { Resolvers } from '../../../generated/graphql';
import { buildRefRelationKey } from '../../../schema/general';
import { RELATION_CREATED_BY, RELATION_OBJECT_ASSIGNEE, RELATION_OBJECT_LABEL, RELATION_OBJECT_MARKING } from '../../../schema/stixRefRelationship';
import { stixDomainObjectDelete } from '../../../domain/stixDomainObject';
import { addFeedback, feedbackContainsStixObjectOrStixRelationship, feedbackEditAuthorizedMembers, findAll, findById } from './feedback-domain';
import { getAuthorizedMembers } from '../../../utils/authorizedMembers';
import { getUserAccessRight } from '../../../utils/access';

const feedbackResolvers: Resolvers = {
  Query: {
    feedback: (_, { id }, context) => findById(context, context.user, id),
    feedbacks: (_, args, context) => findAll(context, context.user, args),
    feedbackContainsStixObjectOrStixRelationship: (_, args, context) => {
      return feedbackContainsStixObjectOrStixRelationship(context, context.user, args.id, args.stixObjectOrStixRelationshipId);
    },
  },
  Feedback: {
    authorizedMembers: (feedback, _, context) => getAuthorizedMembers(context, context.user, feedback),
    currentUserAccessRight: (feedback, _, context) => getUserAccessRight(context.user, feedback),
  },
  FeedbacksFilter: {
    createdBy: buildRefRelationKey(RELATION_CREATED_BY),
    assigneeTo: buildRefRelationKey(RELATION_OBJECT_ASSIGNEE),
    markedBy: buildRefRelationKey(RELATION_OBJECT_MARKING),
    labelledBy: buildRefRelationKey(RELATION_OBJECT_LABEL),
    creator: 'creator_id',
  },
  FeedbacksOrdering: {
    creator: 'creator_id',
  },
  Mutation: {
    feedbackAdd: (_, { input }, context) => {
      return addFeedback(context, context.user, input);
    },
    feedbackDelete: (_, { id }, context) => {
      return stixDomainObjectDelete(context, context.user, id);
    },
    feedbackEditAuthorizedMembers: (_, { id, input }, context) => {
      return feedbackEditAuthorizedMembers(context, context.user, id, input);
    },
  }
};

export default feedbackResolvers;
