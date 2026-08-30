-- Create forms table
CREATE TABLE IF NOT EXISTS "forms" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "slug" varchar(255) NOT NULL,
  "is_published" integer NOT NULL DEFAULT 0,
  "is_enabled" integer NOT NULL DEFAULT 1,
  "submit_button_text" varchar(100) NOT NULL DEFAULT 'Submit',
  "success_message" text NOT NULL DEFAULT 'Thank you for your submission!',
  "redirect_url" text NOT NULL DEFAULT '',
  "allow_multiple_submissions" integer NOT NULL DEFAULT 1,
  "collect_email" integer NOT NULL DEFAULT 0,
  "collect_name" integer NOT NULL DEFAULT 0,
  "form_structure" text NOT NULL DEFAULT '{"sections":[],"conditionalLogic":[]}',
  "background_color" varchar(30) NOT NULL DEFAULT '#ffffff',
  "text_color" varchar(30) NOT NULL DEFAULT '#1a1a1a',
  "button_color" varchar(30) NOT NULL DEFAULT '#FF6B6B',
  "border_radius" varchar(20) NOT NULL DEFAULT 'rounded-lg',
  "total_responses" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "forms_profile_id_profiles_id_fk"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE
);

-- Create form_responses table
CREATE TABLE IF NOT EXISTS "form_responses" (
  "id" serial PRIMARY KEY NOT NULL,
  "form_id" integer NOT NULL,
  "profile_id" integer NOT NULL,
  "response_data" text NOT NULL DEFAULT '{}',
  "submitter_email" varchar(255) NOT NULL DEFAULT '',
  "submitter_name" varchar(255) NOT NULL DEFAULT '',
  "submitter_ip" varchar(128) NOT NULL DEFAULT '',
  "user_agent" text NOT NULL DEFAULT '',
  "is_read" integer NOT NULL DEFAULT 0,
  "is_starred" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "form_responses_form_id_forms_id_fk"
    FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE,
  CONSTRAINT "form_responses_profile_id_profiles_id_fk"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE
);
