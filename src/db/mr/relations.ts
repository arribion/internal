import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	admins: {
		usersViaBlogs: r.many.users({
			from: r.admins.email.through(r.blogs.authorRole),
			to: r.users.id.through(r.blogs.authorId),
			alias: "admins_email_users_id_via_blogs"
		}),
		usersViaGallery: r.many.users({
			from: r.admins.email.through(r.gallery.authorRole),
			to: r.users.id.through(r.gallery.authorId),
			alias: "admins_email_users_id_via_gallery"
		}),
		usersViaTeam: r.many.users({
			from: r.admins.email.through(r.team.authorRole),
			to: r.users.id.through(r.team.authorId),
			alias: "admins_email_users_id_via_team"
		}),
	},
	users: {
		adminsViaBlogs: r.many.admins({
			alias: "admins_email_users_id_via_blogs"
		}),
		adminsViaGallery: r.many.admins({
			alias: "admins_email_users_id_via_gallery"
		}),
		adminsViaTeam: r.many.admins({
			alias: "admins_email_users_id_via_team"
		}),
	},
}))