import { db } from "~/db"
import { getId } from "~/utils"

const schema = {
  title: "Events divisions contestants schema",
  description: "Events divisions contestants",
  version: 1,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    time: {
      type: "string",
      index: true
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    memberId: {
      type: "string",
      ref: "clubs_members"
    },
    weapon: {
      id: {
        type: "string"
      },
      calibre: {
        type: "string"
      },
      classId: {
        type: "string",
        ref: "classes"
      }
    }
  },
  required: [
    "time",
    "divisionId",
    "memberId",
    "weapon"
  ]
}

const migrationStrategies = {
  1: async (contestant: any) => {
    const participant = await db.events_participants.find({
      memberId: contestant.memberId
    }).exec()

    const weapon = await db.events_participants_weapons.insert({
      calibre: contestant.weapon.calibre,
      classId: contestant.weapon.classId,
      participantId: participant.id
    })

    await db.events_contestants.insert({
      id: getId(),
      stand: 1,
      eventId: participant.eventId,
      divisionId: contestant.divisionId,
      participantId: participant.id,
      weaponId: weapon.id
    })

    return null
  }
}

export default {
  collection: {
    name: "events_divisions_contestants",
    schema: schema,
    migrationStrategies: migrationStrategies
  }
}
