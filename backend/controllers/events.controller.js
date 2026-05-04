import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllEvents = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const events = await prisma.event.findMany({
      include: {
        registrations: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    const formattedEvents = events.map((event) => ({
      ...event,
      isRegistered: event.registrations?.length > 0,
    }));

    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createEvent = async (req, res) => {
    try{
        const {title, description, date, location, maxParticipants} = req.body;
        if(!title || !description || !date || !location || !maxParticipants){
            return res.status(400).json({message: "All fields are required"});
        }

        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                maxParticipants,
                status: "OPEN"
            }
        });

        return res.status(201).json(newEvent);

    } catch(error){
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const registerForEvent = async (req, res) => {
    try {
    const { id } = req.params;
    const userId = req.user.userId;

    const event = await prisma.event.findUnique({
        where: {id}
    });

    if(!event){
        return res.status(404).json({message: "Event not found"});
    }

    if(event.status !== "OPEN"){
        return res.status(400).json({message: "Registeration for this event is closed"});
    }

    const existingRegisteration = await prisma.registration.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId: id
            }
        }
    });

    if(existingRegisteration){
        return res.status(400).json({message: "You are already registered for this event"});
    }

    const currentParticipants = await prisma.registration.count({
        where: {eventId: id}
    });

    if(currentParticipants >= event.maxParticipants){
        return res.status(400).json({message: "Event is full"});
    }

    const registration = await prisma.registration.create({
        data: {
            userId,
            eventId: id
        }
    });

    return res.status(201).json({
        message: "Succesfully registered for event",
        registration
    });
} catch(error){
    console.error(error);
    return res.status(500).json({message: "Something went wrong" });
}
};

export const getMyEvents = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const registeration = await prisma.registration.findMany({
            where: {
                userId: userId
            },
            include: {
                event: true
            }
        });
        return res.status(200).json(registeration);
    } catch(error){
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const closeEvent = async (req, res) => {
    try{
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: {id}
        });
        if(!event){
            return res.status(404).json({message: "Event not found"});
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                status: "CLOSED"
            }
        });
        return res.status(200).json({
            message: "Event closed succesfully",
            event: updatedEvent
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const getEventParticipants = async (req, res) => {
    try{
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id }
        });

        if(!event) {
            return res.status(404).json({message: "Event not found"});
        }

        const participants = await prisma.registration.findMany({
            where: {
                eventId: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            event: event.title,
            participants
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await prisma.event.delete({
      where: { id }
    });

    return res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};