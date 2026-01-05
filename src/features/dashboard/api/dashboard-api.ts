import { baseApi } from "@/store/api/base-api";

// API Response Types
export interface DashboardApiResponse {
  status: boolean;
  data: {
    projects_summary: {
      count: number;
      chart: Record<string, number>; // e.g., {"2025-12": 9}
    };
    tasks: {
      completed: number;
      in_progress: number;
      waiting_feedback: number;
      canceled: number;
    };
    meetings: Array<{
      meeting_name: string;
      date: string;
      start: string;
      end: string;
      project: string;
    }>;
    invoice_status: {
      paid: number;
      unpaid: number;
      overdue: number;
    };
    projects: Array<{
      id: number;
      name: string;
      date: string;
      status: string;
    }>;
    sliders: Array<any>;
  };
}

// Projects API Response Types
export interface ProjectsApiResponse {
  status: boolean;
  data: {
    status_cards: {
      all: number;
      completed: number;
      ongoing: number;
      pending: number;
    };
    projects: Array<{
      id: number;
      name: string;
      description: string;
      team: Array<{
        id: number;
        name: string;
        avatar?: string;
      }>;
      start_date: string | null;
      deadline: string | null;
      budget: string | null;
      proposals: Array<any>;
      tasks: {
        completed: number;
        total: number;
        percentage: number;
      };
      contract: any;
      status: string;
      type: string;
      last_update: string;
    }>;
  };
}

// Project Overview API Response Types
export interface ProjectOverviewApiResponse {
  status: boolean;
  data: {
    project: {
      id: number;
      name: string;
      milestones: Array<{
        id: number;
        name: string;
        phase: string;
        status: string;
        start_date: string;
        end_date: string;
        tasks: Array<{
          id: number;
          title: string;
          status: string;
          updated_at: string;
          assignees: Array<{
            id: number;
            name: string;
          }>;
        }>;
      }>;
      notes: string;
      status: string;
      type: string;
      last_update: string;
      addons: Array<any>;
      progress_timeline: {
        planning: number;
        design: number;
        development: number;
        testing: number;
      };
      activity_notes: Array<{
        type: string;
        message: string;
        date: string;
      }>;
      open_tasks: number;
      days_left: number;
    };
  };
}

// Task Details API Response Types
export interface TaskDetailsApiResponse {
  status: boolean;
  message: string;
  data: {
    task: {
      id: number;
      label: string;
      description: string;
      priority: string;
      status: string;
      start_date: string;
      due_date: string;
      progress: number;
    };
    project: {
      id: number;
      name: string;
    };
    milestone: {
      id: number;
      name: string;
    };
    team: Array<{
      id: number;
      name: string;
      image: string;
      status: string;
    }>;
    screens: {
      completed: Array<{
        id: number;
        name: string;
        screen_code: string;
        comment: string;
        image: string | null;
        implemented: number;
        integrated: number;
      }>;
      remaining: Array<{
        id: number;
        name: string;
        screen_code: string;
        comment: string;
        image: string | null;
        implemented: number;
        integrated: number;
      }>;
    };
  };
}

// Task Discussion API Response Types
export interface TaskDiscussionApiResponse {
  status: boolean;
  task: {
    id: number;
    title: string;
  };
  discussions: Array<{
    id: number;
    message: string;
    status: string;
    created_by: {
      id: number;
      type: string;
      name: string;
      avatar: string;
    };
    created_at: string;
    team: Array<{
      id: number;
      name: string;
      avatar: string;
      type: string;
      role: string;
    }>;
  }>;
}

// Single Task Discussion API Response Types
export interface SingleTaskDiscussionApiResponse {
  status: boolean;
  discussion: {
    id: number;
    message: string;
    status: string;
    created_by: {
      id: number;
      type: string;
      name: string;
      avatar: string;
    };
    created_at: string;
    task: {
      id: number;
      label: string;
    };
    milestone: {
      id: number;
      title: string;
    };
    project: {
      id: number;
      name: string;
    };
  };
}

// Discussion Messages API Response Types
export interface DiscussionMessagesApiResponse {
  status: boolean;
  message: string;
  data: {
    discussion_id: number;
    task_id: number;
    messages: Array<{
      id: number;
      discussion_id: number;
      task_id: number;
      sender_type: string;
      sender_id: number;
      message: string;
      created_at: string;
      updated_at: string;
      type: string;
      file_path: string | null;
      sender: {
        id: number;
        name: string;
        email: string;
        phone: string;
        image?: string;
        photo?: string;
      };
    }>;
  };
}
// Project Attachments API Response Types
export interface ProjectAttachmentsApiResponse {
  status: boolean;
  data: Array<{
    id: number;
    file_path: string;
    file_type: string;
    uploaded_by_id: number;
    date_uploaded: string;
    last_activity: string;
    uploaded_by: {
      id: number;
      name: string;
      image: string | null;
      type: string;
    };
  }>;
}

// Project Invoices API Response Types
export interface ProjectInvoicesApiResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: number;
    status: string;
    payment_method: string;
    created_at: string;
    due_date: string;
    amount: string;
    project_name: string;
    client_name: string;
  }>;
}

// Products API Response Types
export interface ProductsApiResponse {
  status: boolean;
  products: Array<{
    id: number;
    name: string;
    price: string;
    description: string;
    image: string | null;
    category_name: string;
    background_image: string;
    type: string;
  }>;
  sliders: Array<any>;
}

// Product Details API Response Types
export interface ProductDetailsApiResponse {
  status: boolean;
  data: {
    id: number;
    name: string;
    description: string;
    price: string;
    note: string;
    image: string | null;
    background_image: string;
    type: string;
    created_at: string;
    updated_at: string;
    media: Array<{
      id: number;
      file_path: string;
      type: string;
    }>;
    attachments: Array<{
      id: number;
      file_path: string;
    }>;
    addons: Array<{
      id: number;
      name: string;
      price: string;
    }>;
  };
}

// Meetings API Response Types
export interface MeetingsApiResponse {
  status: boolean;
  data: Array<{
    id: number;
    meeting_name: string;
    description: string;
    project_name: string;
    start_time: string;
    end_time: string;
    status: string;
    notes: string | null;
    can_add_notes: boolean;
    has_notes: boolean;
  }>;
}

// Meeting Summary API Response Types
export interface MeetingSummaryApiResponse {
  status: boolean;
  data: {
    id: number;
    meeting_name: string;
    project_name: string;
    date: string;
    time: {
      start: string;
      end: string;
    };
    duration_minutes: number;
    status: string;
    meeting_platform: string;
    jitsi_url: string | null;
    notes: Array<string>;
    employees: Array<{
      id: number;
      name: string;
      image: string | null;
    }>;
    action_log: Array<{
      date: string;
      action: string;
      details: string;
    }>;
  };
}

// Project Categories API Response Types
export interface ProjectCategoriesApiResponse {
  status: boolean;
  message: string;
  data: {
    data: Array<{
      id: number;
      name: string;
      visible: number;
      created_at: string;
      updated_at: string;
    }>;
    from: number;
    per_page: number;
    to: number;
    total: number;
    count: number;
  };
}

// Create Project API Response Types
export interface CreateProjectApiResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    category_id: number;
    description: string;
    note: string;
    created_at: string;
    updated_at: string;
  };
}

// Available Slots API Response Types
export interface AvailableSlotsApiResponse {
  status: boolean;
  message: string;
  data: Array<{
    slot_id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: boolean;
  }>;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientDashboard: builder.query<DashboardApiResponse, void>({
      query: () => ({
        url: "dashboard",
        method: "GET",
      }),
    }),
    getClientProjects: builder.query<ProjectsApiResponse, void>({
      query: () => ({
        url: "dashboard/projects",
        method: "GET",
      }),
    }),
    getProjectOverview: builder.query<ProjectOverviewApiResponse, number>({
      query: (projectId) => ({
        url: `project/overview/${projectId}`,
        method: "GET",
      }),
    }),
    getTaskDetails: builder.query<TaskDetailsApiResponse, number>({
      query: (taskId) => ({
        url: `project/task-details/${taskId}`,
        method: "GET",
      }),
    }),
    getTaskDiscussion: builder.query<TaskDiscussionApiResponse, number>({
      query: (taskId) => ({
        url: `tasks/${taskId}/alldiscussions`,
        method: "GET",
      }),
    }),
    getDiscussionMessages: builder.query<DiscussionMessagesApiResponse, number>({
      query: (discussionId) => ({
        url: `discussions/${discussionId}/messages`,
        method: "GET",
      }),
    }),
    sendDiscussionMessage: builder.mutation<
      { status: boolean; message: string },
      { discussionId: number; type: string; message: string }
    >({
      query: ({ discussionId, type, message }) => ({
        url: `discussions/${discussionId}/messages`,
        method: "POST",
        body: { type, message },
      }),
    }),
    getProjectAttachments: builder.query<ProjectAttachmentsApiResponse, number>({
      query: (projectId) => ({
        url: `project/${projectId}/attachments`,
        method: "GET",
      }),
    }),
    uploadProjectAttachment: builder.mutation<{ status: boolean; message: string }, { projectId: number; file: File }>({
      query: ({ projectId, file }) => {
        const formData = new FormData();
        formData.append("attachments", file);
        
        return {
          url: `project/${projectId}/attachments`,
          method: "POST",
          body: formData,
        };
      },
    }),
    getProjectInvoices: builder.query<ProjectInvoicesApiResponse, number>({
      query: (projectId) => ({
        url: `projects/${projectId}/invoices`,
        method: "GET",
      }),
    }),
    getProducts: builder.query<ProductsApiResponse, void>({
      query: () => ({
        url: "our-products",
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Don't cache this query
      transformResponse: (response: any) => {
        console.log("Transform Response - Raw:", response);
        console.log("Transform Response - Products:", response?.products);
        return response;
      },
    }),
    getProductDetails: builder.query<ProductDetailsApiResponse, number>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: "GET",
      }),
    }),
    getMeetings: builder.query<MeetingsApiResponse, void>({
      query: () => ({
        url: "meetings",
        method: "GET",
      }),
    }),
    getMeetingSummary: builder.query<MeetingSummaryApiResponse, number>({
      query: (meetingId) => ({
        url: `meeting-summary/${meetingId}`,
        method: "GET",
      }),
    }),
    deleteMeeting: builder.mutation<{ status: boolean; message: string }, number>({
      query: (meetingId) => ({
        url: `meetings/${meetingId}`,
        method: "DELETE",
      }),
    }),
    cancelMeeting: builder.mutation<{ status: boolean; message: string }, number>({
      query: (meetingId) => ({
        url: `meetings/${meetingId}/cancel`,
        method: "PATCH",
      }),
    }),
    addMeetingNotes: builder.mutation<
      { status: boolean; message: string },
      { meetingId: number; notes: string }
    >({
      query: ({ meetingId, notes }) => ({
        url: `meetings/${meetingId}/notes`,
        method: "POST",
        body: { notes },
      }),
    }),
    getAvailableSlots: builder.query<AvailableSlotsApiResponse, void>({
      query: () => ({
        url: "available-slots",
        method: "GET",
      }),
    }),
    createMeeting: builder.mutation<
      { status: boolean; message: string },
      {
        slot_id: number;
        task_id: string;
        meeting_name: string;
        description: string;
        start_time: string;
        end_time: string;
        project_id: number;
        status?: string;
      }
    >({
      query: (data) => ({
        url: "meetings",
        method: "POST",
        body: data,
      }),
    }),
    rescheduleMeeting: builder.mutation<
      { status: boolean; message: string },
      {
        meetingId: number;
        slot_id: number;
        meeting_name: string;
        description: string;
        start_time: string;
        end_time: string;
        project_id: number;
        jitsi_url?: string;
        status?: string;
      }
    >({
      query: ({ meetingId, ...data }) => ({
        url: `meetings/${meetingId}`,
        method: "PUT",
        body: data,
      }),
    }),
    joinMeeting: builder.query<MeetingSummaryApiResponse, number>({
      query: (meetingId) => ({
        url: `meetings/${meetingId}/join`,
        method: "GET",
      }),
    }),
    getProjectCategories: builder.query<ProjectCategoriesApiResponse, void>({
      query: () => ({
        url: "category",
        method: "GET",
      }),
    }),
    createProject: builder.mutation<
      CreateProjectApiResponse,
      FormData
    >({
      query: (formData) => ({
        url: "projects",
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetClientDashboardQuery, 
  useGetClientProjectsQuery,
  useGetProjectOverviewQuery,
  useGetTaskDetailsQuery,
  useGetTaskDiscussionQuery,
  useGetDiscussionMessagesQuery,
  useSendDiscussionMessageMutation,
  useGetProjectAttachmentsQuery,
  useUploadProjectAttachmentMutation,
  useGetProjectInvoicesQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetMeetingsQuery,
  useGetMeetingSummaryQuery,
  useDeleteMeetingMutation,
  useCancelMeetingMutation,
  useAddMeetingNotesMutation,
  useGetAvailableSlotsQuery,
  useCreateMeetingMutation,
  useRescheduleMeetingMutation,
  useJoinMeetingQuery,
  useGetProjectCategoriesQuery,
  useCreateProjectMutation
} = dashboardApi;
