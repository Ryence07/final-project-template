export async function getAll(pool) {
    const result = await pool.query(`
    SELECT
      p.id,
      p.brand,
      p.model,
      p.price,
      p.description,
      p.weight,
      p.shape,
      p.power,
      p.control,
      p.spin,
      COALESCE(
        ARRAY(
          SELECT pr.skill_level
          FROM paddle_recommendations pr
          WHERE pr.paddle_id = p.id
          ORDER BY pr.skill_level
        ),
        '{}'
      ) AS "recommendedFor",
      COALESCE(
        ARRAY(
          SELECT ps.style
          FROM paddle_styles ps
          WHERE ps.paddle_id = p.id
          ORDER BY ps.style
        ),
        '{}'
      ) AS styles
    FROM paddles p
    ORDER BY p.id
  `)

    return result.rows
}

export async function getById(pool, id) {
    const result = await pool.query(
        `
      SELECT
        p.id,
        p.brand,
        p.model,
        p.price,
        p.description,
        p.weight,
        p.shape,
        p.power,
        p.control,
        p.spin,
        COALESCE(
          ARRAY(
            SELECT pr.skill_level
            FROM paddle_recommendations pr
            WHERE pr.paddle_id = p.id
            ORDER BY pr.skill_level
          ),
          '{}'
        ) AS "recommendedFor",
        COALESCE(
          ARRAY(
            SELECT ps.style
            FROM paddle_styles ps
            WHERE ps.paddle_id = p.id
            ORDER BY ps.style
          ),
          '{}'
        ) AS styles
      FROM paddles p
      WHERE p.id = $1
    `,
        [id]
    )

    return result.rows[0] ?? null
}