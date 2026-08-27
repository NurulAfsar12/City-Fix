export function publicUser(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        profile_image: row.profile_image ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

export function now() {
    return new Date();
}

export function validationError(res, errors) {
    return res.status(422).json({
        success: false,
        message: errors[0] || "The given data was invalid.",
        errors,
    });
}

export function notFound(res, resource) {
    return res.status(404).json({
        success: false,
        message: `${resource} not found.`,
    });
}

export async function getReportWithRelations(sql, reportId) {
    const rows = await sql`
        SELECT
            r.*,
            c.id AS category_id_rel,
            c.name AS category_name,
            c.slug AS category_slug,
            c.icon AS category_icon,
            u.id AS user_id_rel,
            u.name AS user_name,
            u.email AS user_email,
            a.id AS assignment_id_rel,
            a.status AS assignment_status,
            w.id AS worker_id_rel,
            w.name AS worker_name,
            w.email AS worker_email
        FROM reports r
        LEFT JOIN categories c ON c.id = r.category_id
        LEFT JOIN users u ON u.id = r.user_id
        LEFT JOIN assignments a ON a.report_id = r.id AND a.status IN ('assigned', 'in_progress')
        LEFT JOIN users w ON w.id = a.worker_id
        WHERE r.id = ${reportId}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return null;
    }

    return attachReportRelations(rows[0]);
}

export function attachReportRelations(row) {
    const {
        category_id_rel,
        category_name,
        category_slug,
        category_icon,
        user_id_rel,
        user_name,
        user_email,
        assignment_id_rel,
        assignment_status,
        worker_id_rel,
        worker_name,
        worker_email,
        ...report
    } = row;

    report.category = category_id_rel
        ? {
              id: category_id_rel,
              name: category_name,
              slug: category_slug,
              icon: category_icon,
          }
        : null;

    report.user = user_id_rel
        ? {
              id: user_id_rel,
              name: user_name,
              email: user_email,
          }
        : null;

    report.assignment = assignment_id_rel
        ? {
              id: assignment_id_rel,
              status: assignment_status,
              worker: worker_id_rel
                  ? {
                        id: worker_id_rel,
                        name: worker_name,
                        email: worker_email,
                    }
                  : null,
          }
        : null;

    return report;
}

export async function getAssignmentWithRelations(sql, assignmentId) {
    const rows = await sql`
        SELECT
            a.*,
            r.id AS report_id_rel,
            r.user_id AS report_user_id,
            r.category_id AS report_category_id,
            r.title AS report_title,
            r.description AS report_description,
            r.location AS report_location,
            r.image AS report_image,
            r.status AS report_status,
            r.priority AS report_priority,
            r.resolved_at AS report_resolved_at,
            r.created_at AS report_created_at,
            r.updated_at AS report_updated_at,
            w.id AS worker_id_rel,
            w.name AS worker_name,
            w.email AS worker_email,
            w.phone AS worker_phone
        FROM assignments a
        LEFT JOIN reports r ON r.id = a.report_id
        LEFT JOIN users w ON w.id = a.worker_id
        WHERE a.id = ${assignmentId}
        LIMIT 1
    `;

    if (rows.length === 0) {
        return null;
    }

    return attachAssignmentRelations(rows[0]);
}

export function attachAssignmentRelations(row) {
    const {
        report_id_rel,
        report_user_id,
        report_category_id,
        report_title,
        report_description,
        report_location,
        report_image,
        report_status,
        report_priority,
        report_resolved_at,
        report_created_at,
        report_updated_at,
        worker_id_rel,
        worker_name,
        worker_email,
        worker_phone,
        ...assignment
    } = row;

    assignment.report = report_id_rel
        ? {
              id: report_id_rel,
              user_id: report_user_id,
              category_id: report_category_id,
              title: report_title,
              description: report_description,
              location: report_location,
              image: report_image,
              status: report_status,
              priority: report_priority,
              resolved_at: report_resolved_at,
              created_at: report_created_at,
              updated_at: report_updated_at,
          }
        : null;

    assignment.worker = worker_id_rel
        ? {
              id: worker_id_rel,
              name: worker_name,
              email: worker_email,
              phone: worker_phone,
          }
        : null;

    return assignment;
}

const REPORT_STATUSES = ["pending", "in_review", "assigned", "in_progress", "resolved", "rejected"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export function isValidReportStatus(value) {
    return REPORT_STATUSES.includes(value);
}

export function isValidPriority(value) {
    return PRIORITIES.includes(value);
}

export function normalizePriority(value) {
    return value === "normal" ? "medium" : value;
}
