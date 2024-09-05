import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import DashboardContent from '../components/dashboard/DashboardContent';
import PromotionsContent from '../components/promotions/PromotionsContent';
import EventsContent from '../components/events/EventsContent';
import PromotionForm from '../components/promotions/PromotionForm';
import EventForm from '../components/events/EventForm';
import useWindowSize from '../hooks/useWindowSize';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPromotionFormOpen, setIsPromotionFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Summer Sale', discount: '20%', duration: 'Jun 1 - Aug 31' }
  ]);
  const [events, setEvents] = useState([
    { id: 1, name: 'Grand Opening', date: 'July 1, 2023', time: '10:00 AM - 6:00 PM', location: 'Main Plaza' }
  ]);

  const { isMobile } = useWindowSize();

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setIsPromotionFormOpen(true);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />
      <div className="pt-16">
        {activeTab === 'dashboard' && <DashboardContent setIsPromotionFormOpen={setIsPromotionFormOpen} setIsEventFormOpen={setIsEventFormOpen} />}
        {activeTab === 'promotions' && <PromotionsContent promotions={promotions} handleEditPromotion={handleEditPromotion} handleDeletePromotion={handleDeletePromotion} setIsPromotionFormOpen={setIsPromotionFormOpen} />}
        {activeTab === 'events' && <EventsContent events={events} handleEditEvent={handleEditEvent} handleDeleteEvent={handleDeleteEvent} setIsEventFormOpen={setIsEventFormOpen} />}
      </div>
      <PromotionForm
        isOpen={isPromotionFormOpen}
        onClose={() => {
          setIsPromotionFormOpen(false);
          setEditingPromotion(null);
        }}
        editingPromotion={editingPromotion}
        setPromotions={setPromotions}
        promotions={promotions}
      />
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
        setEvents={setEvents}
        events={events}
      />
    </div>
  );
};

export default Dashboard;