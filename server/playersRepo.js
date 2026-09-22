export async function getAll(pool) {
    const result = await pool.query(`
    SELECT
      id,
      name,
      skill_level AS "skillLevel",
      playing_style AS "playingStyle",
      availability,
      wins,
      losses,
      points
    FROM players
    ORDER BY points DESC
  `)

    return result.rows
}

export async function getById(pool, id) {
    const result = await pool.query(
        `
      SELECT
        id,
        name,
        skill_level AS "skillLevel",
        playing_style AS "playingStyle",
        availability,
        wins,
        losses,
        points
      FROM players
      WHERE id = $1
    `,
        [id]
    )

    return result.rows[0] ?? null
}